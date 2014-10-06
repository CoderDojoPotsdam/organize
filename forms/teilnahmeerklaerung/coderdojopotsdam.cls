\LoadClass[9pt]{scrartcl}

\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{coderdojopotsdam}

\RequirePackage{mathtools}
\RequirePackage[MnSymbol]{mathspec}
\RequirePackage{geometry}
\RequirePackage{graphicx}
\RequirePackage{siunitx}
\RequirePackage{array}
\RequirePackage{pgf}
\RequirePackage{pgfpages}
\RequirePackage{color}
\RequirePackage{soul}
\RequirePackage{lastpage}
\RequirePackage{xcolor,colortbl}
\RequirePackage{booktabs}
\RequirePackage{tabu}
\RequirePackage[stretch=10,shrink=10]{microtype}
\RequirePackage{fancyhdr}
\RequirePackage[style=english,english=american]{csquotes}
\MakeOuterQuote{"}
\RequirePackage[compact]{titlesec}
\RequirePackage{titletoc}
\RequirePackage[pdfstartview=FitW]{hyperref}

\RequirePackage{polyglossia}
\setmainlanguage{german}

\setallmainfonts
[
	BoldFont={* Bold},
	ItalicFont={* Italic},
	BoldItalicFont={* Bold Italic},
]{Source Sans Pro}

\sisetup{detect-weight=true, detect-family=true}
\DeclareSIUnit[number-unit-product = \,]{\euro}{€}

\definecolor{primaryColor}{RGB}{1, 149, 255}
\definecolor{grey}{RGB}{224, 224, 224}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%
%% Options
%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\makeatletter

\pagenumbering{arabic}

%\newcommand{\sectionbreak}{\addvspace{0pt}
%\newcommand{\subsectionbreak}{\addvspace{10\p@ \@plus 5\p@}}
%\newcommand{\subsubsectionbreak}{\addvspace{10\p@ \@plus 5\p@}}
\renewcommand{\thesection}{\arabic{section}}
\renewcommand{\thesubsection}{\arabic{section}.\arabic{subsection}}
\renewcommand{\thesubsubsection}{\arabic{section}.\arabic{subsection}.\arabic{subsubsection}}

\titleformat{\section}[runin]{\fontsize{9pt}{9pt}\selectfont\bfseries\uppercase}{\thesection}{0pt}{}[\hspace*{5pt}]

\geometry{a4paper,left=35mm,right=25mm,bottom=20mm,top=0mm,headheight=20mm,headsep=0mm,footskip=0mm,includeheadfoot,twoside}

\sloppy
\tolerance=500
\emergencystretch=4pt

\linespread{1.25}
\tabcolsep=0pt
\parindent=0pt
\setlength\parskip{5\p@ \@plus 10\p@}
\topskip=0pt
\abovedisplayskip=0pt
\belowdisplayskip=0pt
\abovedisplayshortskip=0pt
\belowdisplayshortskip=0pt
\fboxrule=0pt
\fboxsep=0pt

\newcommand\coderDojoLogo
{%
	\includegraphics[height=1.5cm]{logo.pdf}%
}

\AtBeginDocument
{%
	\linespread{1.0}%
	\parbox[c]{5cm}{\coderDojoLogo}%
	\parbox[c]{10cm}{\hfill\fontsize{18pt}{18pt}\selectfont\bfseries\MakeUppercase{\@title}}%
	\vspace*{10pt}%
	\par%
}

\newcommand{\textfield}[2]
{%
	#2:\hspace*{5pt}\colorbox{grey}{\raisebox{3pt}{\parbox[c][18pt][c]{#1}{~}}}%
}

\newcommand{\signature}
{%
	\parbox[b]{7.375cm}{\centering\colorbox{grey}{\parbox[c][18pt][c]{7.375cm}{~}} \\[5pt] Ort, Datum}\hspace*{0.25cm}%
	\parbox[b]{7.375cm}{\centering\colorbox{grey}{\parbox[c][2cm][c]{7.375cm}{~}} \\[5pt] Unterschrift des Erziehungsberechtigten}%
}

\selectfont
\flushbottom

\pagestyle{empty}

\makeatother
