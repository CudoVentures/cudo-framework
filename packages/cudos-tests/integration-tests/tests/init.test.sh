#!/bin/bash
source ./packages/cudos-tests/integration-tests/vars.sh

echo -n 'cudos init...'
mkdir $INIT_FOLDER && cd $INIT_FOLDER
cudos init &> /dev/null

if [[ ! `ls` == $TEMPLATE_FILES ]]; then
    echo -e "$FAILED\nGenerated folder is invalid!" 1>&2
    exit_status=1
else
    echo -e "$PASSED"
fi

rm -r ../$INIT_FOLDER &> /dev/null
exit $exit_status
