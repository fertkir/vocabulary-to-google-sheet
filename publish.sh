cd build/release

user="fertkir"
project="vocabulary-to-google-sheet"
passing_password=""

if command -v secret-tool &> /dev/null
then
    passing_password="sshpass -p \"$(secret-tool lookup sourceforge password)\""
fi
 
command="$passing_password rsync -avP --ignore-existing -e ssh * $user@frs.sourceforge.net:/home/frs/project/$project/"

eval $command