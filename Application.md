## Application
- The app is a Books library using the Open Library Subjects and Search APIs
- `Subjects API` doc - [https://openlibrary.org/dev/docs/api/subjects](https://openlibrary.org/dev/docs/api/subjects)
- `Search API` doc - [https://openlibrary.org/dev/docs/api/search](https://openlibrary.org/dev/docs/api/search)

## Challenge
### Your tasks
- Add Missing Features.
- Deploy using Netlify, vercel or Heroku or any other platform and the deployment link (a live version of the application) should be shared.

Once you are done with your task, please use this form [https://forms.gle/wBLwzmz1Gs5CsRFp7](https://forms.gle/wBLwzmz1Gs5CsRFp7) to complete your submission.
You will hear back within 48 hours from us via email.

---
## Available 
*You can fork this repo and follow instructions on the README.md to view this*
### Trending Subjects 
- clicking on each of this will navigate to a new URL 
- which will load the data using the `Subjects API` referenced above.

## Missing Features
*You will need to implement this*
### Search box
- Make the search box to allows us to search books by booktitle or author name - can use the `Search API` referenced above for this.
the results must be shown in the same home page and using the table view component.
- The results must be paginated - not more than 10 search results must be retrieved in one go (use `offset` and `limit`) - there must be a way to view the `Next` set of search results and similarly also be able to view the `Previous` page results.
- The search key must be visible in the search box and there must be a way to clear the searched text.

### Fix Bugs
- Handle `No results found` and other `API` errors.
- Add Loaders on the page while fetching data for both the Trending Subjects redirected table view and the new Search result view.
- Add a Back button to `Go back to the home page` from the Trending Subject page.