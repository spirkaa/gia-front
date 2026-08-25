const zlib = require("node:zlib")
const fs = require("node:fs")
const path = require("node:path")

const CONCURRENCY = 4
const SKIP_EXTENSIONS = new Set([".gz", ".br"])
const buildDir = process.argv[2] || "build"

let remainingJobs = 0
let jobsEnqueued = 0
let filesProcessed = 0
let bytesSaved = 0

const queue = []
let inFlight = 0

const summary = function () {
  console.log(
    "Done. Compressed " + filesProcessed + " files, saved " + bytesSaved + " bytes.",
  )
}

const jobFinished = function () {
  inFlight--
  remainingJobs--
  if (remainingJobs === 0 && jobsEnqueued > 0) {
    summary()
  }
  pump()
}

const pump = function () {
  while (inFlight < CONCURRENCY && queue.length > 0) {
    inFlight++
    queue.shift()(jobFinished)
  }
}

const enqueue = function (job) {
  jobsEnqueued++
  remainingJobs++
  queue.push(job)
  pump()
}

const compressDir = function (dir) {
  console.log("Reading in: " + dir)
  fs.readdir(dir, function (err, files) {
    if (err) {
      console.error("Could not list the directory.", err)
      process.exit(1)
    }

    if (files.length === 0 && remainingJobs === 0) {
      summary()
      return
    }

    files.forEach(function (file) {
      const filePath = path.join(dir, file)

      enqueue(function (done) {
        fs.stat(filePath, function (error, stat) {
          if (error) {
            console.error("Error stating file.", error)
            return done()
          }

          if (stat.isDirectory()) {
            compressDir(filePath)
            return done()
          }

          if (!stat.isFile()) {
            return done()
          }

          if (SKIP_EXTENSIONS.has(path.extname(filePath).toLowerCase())) {
            return done()
          }

          console.log("Compressing '%s'", filePath)
          compressFile(stat.size, filePath, done)
        })
      })
    })
  })
}

const compressFile = function (originalSize, filePath, done) {
  let finished = 0
  const finishOne = function () {
    if (++finished === 2) {
      filesProcessed++
      done()
    }
  }

  compressBrotli(originalSize, filePath, finishOne)
  compressGzip(originalSize, filePath, finishOne)
}

const pipeCompression = function (
  filePath,
  transform,
  compressedFilePath,
  originalSize,
  settle,
) {
  const input = fs.createReadStream(filePath)
  const output = fs.createWriteStream(compressedFilePath)

  input.pipe(transform).pipe(output)

  const fail = function (label, error) {
    console.error(label, error)
    output.destroy()
    fs.unlink(compressedFilePath, function () {})
    settle()
  }

  input.on("error", function (error) {
    fail("Error reading file.", error)
  })
  transform.on("error", function (error) {
    fail("Error compressing file.", error)
  })
  output.on("error", function (error) {
    fail("Error writing file.", error)
  })
  output.on("finish", function () {
    ensureCompressedSmaller(originalSize, compressedFilePath, settle)
  })
}

const once = function (fn) {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn()
    }
  }
}

const compressBrotli = function (originalSize, filePath, finish) {
  pipeCompression(
    filePath,
    zlib.createBrotliCompress({
      params: {
        [zlib.constants.BROTLI_PARAM_MODE]: getBrotliMode(filePath),
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        [zlib.constants.BROTLI_PARAM_LGWIN]: 22,
      },
    }),
    filePath + ".br",
    originalSize,
    once(finish),
  )
}

const compressGzip = function (originalSize, filePath, finish) {
  pipeCompression(
    filePath,
    zlib.createGzip({ level: 9 }),
    filePath + ".gz",
    originalSize,
    once(finish),
  )
}

const ensureCompressedSmaller = function (originalSize, filePath, callback) {
  fs.stat(filePath, function (compressError, compressStat) {
    if (compressError) {
      console.error("Error stating compressed file.", compressError)
      return callback()
    }

    if (originalSize <= compressStat.size) {
      console.log("Compressed file '%s' is bigger, deleting", filePath)
      fs.unlink(filePath, function (deleteError) {
        if (deleteError) {
          console.error("Error deleting compressed file.", deleteError)
        }
        callback()
      })
    } else {
      bytesSaved += originalSize - compressStat.size
      callback()
    }
  })
}

const getBrotliMode = function (filePath) {
  const ext = path.extname(filePath).toLowerCase()

  switch (ext) {
    case ".js":
    case ".css":
    case ".svg":
    case ".map":
    case ".json":
    case ".html":
    case ".htm":
      return zlib.constants.BROTLI_MODE_TEXT
    default:
      return zlib.constants.BROTLI_MODE_GENERIC
  }
}

compressDir(buildDir)
