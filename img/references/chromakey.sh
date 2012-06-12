#!/usr/bin/env bash
#
# Built by Carl Oscar Aaro <carloscar@agigen.se>, @kalaspuffaaro at Twitter
# KavajuchanLazerEyes(tm), code name "CrabSloth". A web based software for displaying Cosplayers during a show
# created by UppCon and Agigen.
#
# This web application should be run in Chrome in Presentation Mode and uses a virtual green screen for your
# image mixing software / hardware.
#
# This is provided as is and were written during an evening before UppCon, use at own risk. :)
#
#
# Set chroma key and replacement values below and run the script in the img/references and img/cosplays folders.
#

chromakey="#00ff00";
replacement="#00fc00";
mkdir chroma > /dev/null 2> /dev/null;
for x in `find *.jpg`; do
    echo -n "Applying chroma key to file '$x' ...";
    convert \( $x -fuzz 1% -transparent "$chromakey" \) \( -size 400x600 canvas:$replacement \)  -compose dst_over -composite chroma/$x;
    echo " done";
done;