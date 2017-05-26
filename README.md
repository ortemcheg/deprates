## Synopsis
The app looks for the best no-BS deposit rates in Russia.

## Motivation
Russian banks often use some voodoo math to calculate their deposit rates in the way that the rates looks very enticing to their would-be customers.
The Central Bank of Russia (CBR) requires all Russian banks to publish the so-called full deposit rates (or no-BS rates as I call them) for all of their deposits on their sites in the form of XML documents.
The app fetches and parses all those XML documents to find the best rates for a given user's request.

## Data sources
Where does the app take the URLs for those XML docs?

The Central Bank requires that XML docs are published on the root directory of every bank's official site. How do we find those sites?
There's a [page](http://cbr.ru/credit/CO_SitesFull.asp) on the CBR's website which contains a list of banks and their corresponding web-sites.
Sometimes there are more then one site for a given bank, and we don't know which of those is official. So we check each of those to find the XML-file we need.

## How the app works
It works by executing the following steps:
1. Fetch the page with a list of banks and their sites from the CBR's website
2. Parse that page to get the preliminary list of banks and their sites (God bless screenscraping!)
3. Find official sites and exclude all other sites from the list.
4. Fetch all XML docs
5. Parse those docs
6. Save the data from the docs to the database
7. When user makes a request, give them the results.

## License
The code can't be used by anyone for commercial purposes without my permission :pouting_cat:.
