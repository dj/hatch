import os
import sys
from fabric.api import *
from fabric.colors import red, yellow
from fabric.contrib.console import confirm

env.hosts = [os.getenv('HATCH_API_URL')]

CODE_DIR = '/srv/hatch/client'

@task
def deploy(repo_uri=None):
    """
    Deploy latest version of Hatch client from master branch
    """
    if repo_uri is None:
        repo_uri = 'git@github.com:dj/hatch.git'

    # TODO update when tests working
    puts(yellow('Running tests'))
    with settings(warn_only=True):
        tests = local('node_modules/.bin/mocha')
    if tests.failed:
        proceed = 'Tests ' + red('FAILED', bold=True) + '. Proceed anyways?'
        if confirm(proceed):
            msg = 'I accept that I am deploying code '\
                  + red('without running tests') \
                  + ' first.\nI also confirm that I have '\
                  + red('MANUALLY VERIFIED', bold=True) + ' the code '\
                  'I\'m about to deploy works.'
            if not confirm(msg):
                abort(red('Not proceeding'))
        else:
            abort(red('Not proceeding'))

    git_hash = "git ls-remote -h {} master | awk '{{print $1;}}' | cut -c -7".format(repo_uri)
    release_dir = '{}-`{}`'.format(CODE_DIR, git_hash)
    with settings(warn_only=True):
        if run('test -d {}'.format(release_dir)).succeeded:
            msg = 'Latest hatch client already deployed!'
            puts(red(msg, bold=True))
            puts(red('Nothing to do', bold=True))
            return

    puts(yellow('removing any old local builds'))
    with settings(warn_only=True):
        local('rm archive-*.tgz')

    local('node_modules/.bin/gulp build')
    puts(yellow('preparing artifact'))
    puts(yellow('fixing localhost redirect'))
    local("sed -i '' 's/localhost:8080/dev.hatch.yacn.me/' build/js/bundle.js")
    local('rm -rf build/test/')
    local('rm -rf build/less')
    client_dir = 'client-`{}`'.format(git_hash)
    archive = 'archive-`{}`.tgz'.format(git_hash)
    local('mv build {}'.format(client_dir))
    local('tar -cvzf {} {}'.format(archive, client_dir))

    put('archive-*.tgz', '/srv/hatch/')

    with settings(warn_only=True):
        if run('test -d {}'.format(CODE_DIR)).succeeded:
            puts(yellow('removing existing deploy symlink'))
            run('rm {}'.format(CODE_DIR))

    with cd('/srv/hatch'):
        run('tar -xzf {}'.format(archive))
        run('rm {}'.format(archive))

    run('ln -s {} {}'.format(release_dir, CODE_DIR))
    puts(yellow('restarting nginx for good measure'))
    run('sudo service nginx restart')

    if confirm('Cleanup local artifacts?'):
        local('rm -rf {}'.format(client_dir))
        local('rm {}'.format(archive))
