pipeline {
  agent any

  options {
    buildDiscarder(logRotator(numToKeepStr: '10', daysToKeepStr: '60'))
    parallelsAlwaysFailFast()
    disableConcurrentBuilds()
    timeout(time: 10, unit: 'MINUTES')
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

    NODE_IMAGE = 'node:22-alpine'
    NODE_VERSION = '22.23.2'
    ANSIBLE_IMAGE = "${REGISTRY}/${IMAGE_OWNER}/ansible:base"
  }

  stages {
    stage('Run pre-commit') {
      agent {
        docker {
          image env.ANSIBLE_IMAGE
          registryUrl env.REGISTRY_URL
          registryCredentialsId env.REGISTRY_CREDS_ID
          alwaysPull true
          reuseNode true
          args '-v /tmp/.cache:/tmp/.cache'
        }
      }
      when {
        beforeAgent true
        not {
          anyOf {
            tag ''
          }
        }
      }
      steps {
        cache(path: "/tmp/.cache/pre-commit", key: "pre-commit-${hashFiles('**/.pre-commit-config.yaml')}") {
          sh '''#!/bin/bash
            set -e
            if ! command -v node >/dev/null 2>&1; then
              python3 -c "import urllib.request; urllib.request.urlretrieve('https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz','/tmp/node.tgz')"
              tar -xzf /tmp/node.tgz -C /usr/local --strip-components=1
              rm -f /tmp/node.tgz
            fi
            node -v
            for i in 1 2 3; do
              npm ci && break
            done
            export PRE_COMMIT_HOME=/tmp/.cache/pre-commit
            pre-commit run --all-files --show-diff-on-failure --verbose --color always || {
              cat ${PRE_COMMIT_HOME}/pre-commit.log 2>/dev/null || true
              exit 1
            }
          '''
        }
      }
    }

    stage('Run tests') {
      when {
        not {
          anyOf {
            tag ''
          }
        }
      }
      steps {
        script {
          docker.image("${NODE_IMAGE}").inside {
            retry(3) {
              sh 'npm ci'
            }
            sh 'npm run test:coverage'
          }
        }
      }
      post {
        success {
          junit 'reports/junit.xml'
          recordCoverage tools: [[parser: 'COBERTURA', pattern: 'reports/cobertura-coverage.xml']]
        }
        always {
          sh "docker rmi ${NODE_IMAGE}"
        }
      }
    }

    stage('Build assets') {
      when {
        anyOf {
          branch 'main'
          changeRequest()
        }
      }
      steps {
        script {
          docker.image("${NODE_IMAGE}").inside {
            retry(3) {
              sh 'npm ci'
            }
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
        anyOf {
          branch 'main'
          changeRequest()
        }
      }
      steps {
        script {
          buildDockerImage(
            dockerFile: "${DOCKERFILE}",
            tag: "${REVISION}",
            altTag: env.CHANGE_ID ? null : 'latest',
            pushToRegistry: env.CHANGE_ID ? 'no' : 'yes'
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
