const brotli = require("brotli")
const zlib = require("zlib")
const fs = require("fs")
const path = require("path")

const compressDir = function (dir) {
  console.log("Reading in: " + dir)
  fs.readdir(dir, function (err, files) {
    if (err) {
      console.error("Could not list the directory.", err)
      process.exit(1)
    }

    files.forEach(function (file, index) {
      const filePath = path.join(dir, file)

      fs.stat(filePath, function (error, stat) {
        if (error) {
          console.error("Error stating file.", error)
          return
        }

        if (stat.isFile()) {
          console.log("Compressing '%s'", filePath)

          const originalSize = stat.size

          // Read in data to compress
          fs.readFile(filePath, function (readError, readData) {
            if (readError) {
              console.error("Error reading file.", error)
              return
            }

            // Compress
            compressGzip(originalSize, filePath, readData)
            compressBrotli(originalSize, filePath, readData)
          })
        } else if (stat.isDirectory()) {
          compressDir(filePath)
        }
      })
    })
  })
}

const compressBrotli = function (originalSize, filePath, fileData) {
  const compressed = brotli.compress(fileData, {
    mode: getBrotliMode(filePath),
    quality: 11,
    lgwin: 22,
  })

  // Write out the compressed file
  const compressedFilePath = filePath + ".br"
  fs.writeFile(
    compressedFilePath,
    Buffer.from(compressed),
    {
      encoding: "binary",
    },
    function (writeError) {
      if (writeError) {
        console.error("Error writing file.", writeError)
        return
      }

      ensureCompressedSmaller(originalSize, compressedFilePath)
    },
  )
}

const compressGzip = function (originalSize, filePath, fileData) {
  const compressedFilePath = filePath + ".gz"

  zlib.gzip(fileData, function (error, compressedData) {
    if (error) {
      console.error("Error gzipping file.", error)
      return
    }

    fs.writeFile(compressedFilePath, compressedData, function (saveError) {
      if (saveError) {
        console.error("Error writing file.", saveError)
        return
      }

      ensureCompressedSmaller(originalSize, compressedFilePath)
    })
  })
}

const ensureCompressedSmaller = function (originalSize, filePath) {
  // Get filesize of compressed file to ensure compression
  fs.stat(filePath, function (compressError, compressStat) {
    if (originalSize <= compressStat.size) {
      // Uncompressed file is smaller, so delete the compressed file
      console.log("Compressed file '%s' is bigger, deleting", filePath)
      fs.unlink(filePath, function (deleteError) {
        if (deleteError) {
          console.error("Error deleting compressed file.", deleteError)
        }
      })
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
      return 1 // Text
    default:
      return 0 // General
  }
}

compressDir("build")
