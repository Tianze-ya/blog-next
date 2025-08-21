rmdir src\blogs /Q /S
mkdir src\blogs
rmdir public\img\note /Q /S
mkdir public\img\note

xcopy "E:\studyspace\note\_posts" "src\blogs" /Y /S /E
xcopy "E:\studyspace\note\img\note" "public\img\note" /Y /S /E
