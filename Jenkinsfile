def buildImageNoCache(String tag, String altTag = null) {
  IMAGE_TAG = "${tag}"
  DOCKERFILE = ".docker/Dockerfile"
  docker.withRegistry("${REGISTRY_URL}", "${REGISTRY_CREDS_ID}") {
    def myImage = docker.build(
      "${IMAGE_FULLNAME}:${IMAGE_TAG}",
      "--label \"org.opencontainers.image.created=${LABEL_CREATED}\" \
      --label \"org.opencontainers.image.authors=${LABEL_AUTHORS}\" \
      --label \"org.opencontainers.image.url=${LABEL_URL}\" \
      --label \"org.opencontainers.image.source=${GIT_URL}\" \
      --label \"org.opencontainers.image.version=${IMAGE_TAG}\" \
      --label \"org.opencontainers.image.revision=${REVISION}\" \
      --label \"org.opencontainers.image.title=${LABEL_TITLE}\" \
      --label \"org.opencontainers.image.description=${LABEL_DESCRIPTION}\" \
      --progress=plain \
      --pull \
      --no-cache \
      -f ${DOCKERFILE} ."
    )
    myImage.push()
    if(altTag) {
      myImage.push(altTag)
    }
    sh "docker rmi -f \$(docker inspect -f '{{ .Id }}' ${myImage.id})"
  }
}

pipeline {
  agent any

  options {
    buildDiscarder(logRotator(numToKeepStr: '10', daysToKeepStr: '60'))
    parallelsAlwaysFailFast()
    disableConcurrentBuilds()
  }

  environment {
    REGISTRY = 'git.devmem.ru'
    REGISTRY_URL = "https://${REGISTRY}"
    REGISTRY_CREDS_ID = 'gitea-user'
    IMAGE_OWNER = 'cr'
    IMAGE_BASENAME = 'gia-front'
    IMAGE_FULLNAME = "${REGISTRY}/${IMAGE_OWNER}/${IMAGE_BASENAME}"
    LABEL_AUTHORS = 'Ilya Pavlov <piv@devmem.ru>'
    LABEL_TITLE = 'GIA front'
    LABEL_DESCRIPTION = 'GIA front'
    LABEL_URL = 'https://gia.devmem.ru'
    LABEL_CREATED = sh(script: "date '+%Y-%m-%dT%H:%M:%S%:z'", returnStdout: true).toString().trim()
    REVISION = GIT_COMMIT.take(7)
    NODE_IMAGE = 'node:16-alpine'
  }

  stages {
    stage('Set env vars') {
      steps {
        script {
          env.DOCKER_BUILDKIT = 1
        }
      }
    }

    stage('Build assets') {
      steps {
        script {
          image = docker.image("${NODE_IMAGE}")
          image.pull()
          image.inside {
            sh 'npm ci'
            sh 'npm run build'
          }
        }
      }
      post {
        always {
          sh "docker rmi ${NODE_IMAGE}"
        }
      }
    }

    stage('Build image') {
      steps {
        script {
          buildImageNoCache("${REVISION}", 'latest')
        }
      }
    }
  }

  post {
    always {
      emailext(
        to: '$DEFAULT_RECIPIENTS',
        subject: '$DEFAULT_SUBJECT',
        body: '$DEFAULT_CONTENT'
      )
    }
  }
}
