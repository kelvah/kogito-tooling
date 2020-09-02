/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as path from "path";
import * as Git from "nodegit";
import * as util from "util";
import * as fs from "fs";
import { config } from "./config";
import { execSync } from "child_process";
import { Repository, Tree } from "nodegit";

const projectsDir = config.development.server.projectsDir;
const hooksDir = config.development.server.hooksDir;

const createDir = util.promisify(fs.mkdir);
const readDir = util.promisify(fs.readdir);

export const getProjects = (request: any, response: any) => {
  createDir(projectsDir, { recursive: true })
    .then(() => {
      readDir(projectsDir, { withFileTypes: true })
        .then(files => {
          return response
            .status(200)
            .json(
              files.filter(file => file.name.endsWith(".git")).map(file => file.name.substr(0, file.name.length - 4))
            );
        })
        .catch(error => {
          response.status(500).send(error);
        });
    })
    .catch(error => {
      response.status(500).send(error);
    });
};

export const createProject = (request: any, response: any) => {
  const projectName = request.body.name;
  const projectUrl = request.body.url;

  createDir(projectsDir, { recursive: true })
    .then(() => {
      Git.Clone.clone(projectUrl, projectsDir + projectName + ".git", {
        bare: 1
      })
        .then(repository => {
          createDir(hooksDir, { recursive: true }).then(() => {
            fs.readdirSync(hooksDir).forEach(hookFile => {
              fs.copyFileSync(
                path.join(hooksDir, hookFile),
                path.join(projectsDir + projectName + ".git/hooks", hookFile)
              );
              fs.chmodSync(path.join(projectsDir + projectName + ".git/hooks", hookFile), 755);
            });

            response.status(201).end();
          });
        })
        .catch(error => {
          response.status(500).send(error);
        });
    })
    .catch(error => {
      response.status(500).send(error);
    });
};

export const deleteProject = (request: any, response: any) => {
  const projectName = request.params.name;

  fs.rmdirSync(projectsDir + projectName + ".git", { recursive: true });

  return response.status(204).end();
};

export const getProjectFiles = (request: any, response: any) => {
  const projectName = request.params.name;
  const extensions = [".dmn", ".bpmn", ".bpmn2"];
  const files: string[] = [];
  let repoTree: Tree | null = null;

  Git.Repository.openBare(projectsDir + projectName + ".git")
    .then(repo => {
      return repo.getMasterCommit();
    })
    .then(firstCommitOnMaster => {
      return firstCommitOnMaster.getTree();
    })
    .then(tree => {
      repoTree = tree;
      const walker = tree.walk();

      walker.on("entry", entry => {
        if (extensions.some(value => entry.toString().endsWith(value))) {
          files.push(entry.path());
        }
      });

      walker.on("end", entry => {
        return response.status(200).send(files);
      });

      return Promise.resolve(walker.start());
    })
    .catch(error => {
      return response.status(500).send(error);
    });
};

export const createProjectFile = (request: any, response: any) => {
  const projectName = request.params.name;
  const fileRelativePath = request.body.path;

  execSync(`\
    cd ${projectsDir + projectName}.git
    git read-tree HEAD
    newhash=$(echo "" | git hash-object -w --path="${fileRelativePath}" --stdin)
    git update-index --add --cacheinfo 0644 $newhash "${fileRelativePath}"
    newtree=$(git write-tree)
    newcommit=$(git commit-tree $newtree -p HEAD -m 'Added file: ${fileRelativePath}')
    git update-ref HEAD $newcommit
    if [ -f ./hooks/post-receive ] 
    then
      sh hooks/post-receive
    fi
  `, { shell: '/bin/bash' });

  response.status(201).end();
};

export const deleteProjectFile = (request: any, response: any) => {
  const projectName = request.params.name;
  const fileRelativePath = request.query.path;

  execSync(`\
    IFS=$'\\n'
    cd ${projectsDir + projectName}.git
    git read-tree --empty
    for line in $(git ls-tree -r HEAD | grep -v "	${fileRelativePath}")
    do
      IFS=$'\\t'
      read -ra field <<< "$line"
      git update-index --add --cacheinfo \${field[0]// blob /,},\${field[1]// /\\ }
    done
    newtree=$(git write-tree)
    newcommit=$(git commit-tree $newtree -p HEAD -m 'Removed file: ${fileRelativePath}')
    git update-ref HEAD $newcommit
    if [ -f ./hooks/post-receive ] 
    then
      sh hooks/post-receive
    fi
  `, { shell: '/bin/bash' });

  response.status(200).end();
};

export const getProjectFileContent = (request: any, response: any) => {
  const projectName = request.params.name;
  const fileRelativePath = request.query.path;

  Git.Repository.openBare(projectsDir + projectName + ".git")
    .then(async repo => {
      const head = await repo.getBranchCommit("master");
      const tree = await head.getTree();

      const fileEntry = await tree.entryByPath(fileRelativePath);

      response.status(200).send((await repo.getBlob(fileEntry.oid())).toString());
    })
    .catch(error => {
      return response.status(500).send(error);
    });
};

export const setProjectFileContent = (request: any, response: any) => {
  const projectName = request.params.name;
  const fileRelativePath = request.query.path;
  const fileContent = request.body;

  execSync(`\
    cd ${projectsDir + projectName}.git
    git read-tree HEAD
    newhash=$(echo "${fileContent.replace(/\"/g, '\\"')}" | git hash-object -w --path="${fileRelativePath}" --stdin)
    git update-index --add --cacheinfo 0644 $newhash "${fileRelativePath}"
    newtree=$(git write-tree)
    newcommit=$(git commit-tree $newtree -p HEAD -m 'Added file: ${fileRelativePath}')
    git update-ref HEAD $newcommit
    if [ -f ./hooks/post-receive ] 
    then
      sh hooks/post-receive
    fi
  `, { shell: '/bin/bash' });

  response.status(201).end();
};
