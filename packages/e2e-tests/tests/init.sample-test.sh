# The following sample test contains a detailed explanation of the commands and syntax. It is recommended to execute 
# `npm test` first to get a general idea of the behavior. 
# New tests should be placed in `{repo_root}/packages/e2e-tests/tests/` folder. 
# `init.test.sh` covers `blast init` command which should initialize a project inside the current directory. The tests 
# follow the classic Arrange-Act-Assert pattern.

# Command to run all tests: npm test
# Command to run a single test: npm test init.test.sh


# our files start with "#!/bin/bash", which tells your terminal it should use bash to execute the file
#!/bin/bash

# "source" lets you use the contents of a file
source ./vars.sh

# 'echo' prints out the string
# -n flag tells your terminal to stay on the same line after printing out the message
echo -n 'blast init...'

# ARRANGE
# "mkdir" creates a folder at the path specified in INIT_FOLDER variable
# "cd" navigates to the specified directory
# "&&" lets you execute the command that follows it only if the first command is successful
mkdir $INIT_FOLDER && cd $INIT_FOLDER

# ACT
# "&>" hides the output of the command
blast init &> /dev/null

# ASSERT
# "ls -R" lists directory content
# `` executes the command placed inside and provides its output
# we compare the output with the expected folder structure defined in TEMPLATE_FILES
if [[ ! `ls` == $TEMPLATE_FILES || ! `ls scripts` == $TEMPLATE_SCRIPTS_FILES ]]; then

    # if the output doesn't match we print a fail message
    # FAILED variable defines a red colored message
    # -e flag escapes special characters, we need it in order to have colored messages
    # 1>&2 redirects the output to stderr
    echo -e "$FAILED\nGenerated folder is invalid!" 1>&2

    # we are defining a variable with status 1
    # in bash status code 1 means the script was not successful
    exit_status=1
else
    # otherwise we print pass message
    echo -e $PASSED
fi

# we are cleaning up the files generated by the test
# "rm -r" removes the specified directory
rm -r ../$INIT_FOLDER &> /dev/null

# EXIT the script
# if the test fails and exit_status is assigned, the program will exit with status 1
# otherwise the exit_status will be undefined and the program will exit without a status, which means it was successful
exit $exit_status
