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
    IMAGE_OWNER = 'projects'
    IMAGE_BASENAME = 'gia-front'
    IMAGE_FULLNAME = "${REGISTRY}/${IMAGE_OWNER}/${IMAGE_BASENAME}"
    DOCKERFILE = '.docker/Dockerfile'
    LABEL_AUTHORS = 'Ilya Pavlov <piv@devmem.ru>'
    LABEL_TITLE = 'GIA front'
    LABEL_DESCRIPTION = 'GIA front'
    LABEL_URL = 'https://gia.devmem.ru'
    LABEL_CREATED = sh(script: "date '+%Y-%m-%dT%H:%M:%S%:z'", returnStdout: true).toString().trim()
    REVISION = GIT_COMMIT.take(7)

    NODE_IMAGE = 'node:16-alpine'
  }

  stages {
    stage('Build assets') {
      when {
        branch 'main'
        not {
          changeRequest()
        }
      }
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
      when {
        branch 'main'
        not {
          changeRequest()
        }
      }
      steps {
        script {
          buildDockerImage(
            dockerFile: "${DOCKERFILE}",
            tag: "${REVISION}",
            altTag: 'latest'
          )
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
