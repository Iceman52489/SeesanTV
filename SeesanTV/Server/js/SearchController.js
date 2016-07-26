function SearchController(documentLoader, documentURL, loadingDocument) {
  DocumentController.apply(this, arguments);
}

registerAttributeName('searchDocumentURL', SearchController);

SearchController.prototype.handleDocument = DocumentController.prototype.handleDocument;
SearchController.prototype.handleEvent = DocumentController.prototype.handleEvent;

SearchController.prototype.setupDocument = function(document) {
  DocumentController.prototype.setupDocument.call(this, document);

  // Obtain references to some useful elements in the searchTemplate
  const searchTemplateElem = document.getElementsByTagName('searchTemplate').item(0);
  const searchFieldElem = document.getElementsByTagName('searchField').item(0);
  const separatorElem = document.getElementsByTagName('separator').item(0);
  const messageElem = document.getElementById("message");
  const suggestionsElem = document.getElementById("suggestions");
  const defaultResultsElem = document.getElementById("defaultResults");
  const resultsModeElem = document.getElementById("resultsMode");
  const resultsListElem = document.getElementById("resultsList");
  const resultsShelfContainerElem = document.getElementById("resultsShelfContainer");
  const resultsGridContainerElem = document.getElementById("resultsGridContainer");
  const resultsSectionElem = document.getElementById("resultsSection");

  var resultsContainerElem = resultsShelfContainerElem;

  resultsListElem.removeChild(resultsGridContainerElem);
  toggleDefaultResults(true);

  const searchBaseURL = "https://itunes.apple.com/search?";
  const searchResultsLimit = 25;
  const searchMediaType = "movie";
  const searchMediaArtworkWidth = 250;
  const searchMediaArtworkAspectRatio = 1.5;
  const searchMediaTitleFunc = function(item) {
    return item.trackCensoredName || item.trackName || item.collectionCensoredName || item.collectionName;
  };

  const searchMediaArtworkURLFunc = function(item) {
    var result = item.artworkUrl60;

    if(typeof result === "string") {
      result = result.replace("/60x60", "/600x600");
    }

    return result;
  };

  var searchRequest,
      searchTextCache;

  const searchResultsCache = [];
  const searchKeyboard = searchFieldElem.getFeature("Keyboard");

  searchKeyboard.onTextChange = performSearchRequest;

  resultsModeElem.addEventListener("highlight", function(event) {
    const selectedElement = event.target;
    const selectedMode = selectedElement.getAttribute("value");
    setResultsMode(selectedMode);
  });

  suggestionsElem.addEventListener("select", function(event) {
    const selectedElement = event.target;
    const searchValue = selectedElement.getAttribute("value");
    searchKeyboard.text = searchValue;
    performSearchRequest();
  });

  resultsSectionElem.addEventListener("select", function(event) {
    const selectedElement = event.target;
    const resultIndex = selectedElement.getAttribute("resultIndex");
    const resultItem = searchResultsCache[resultIndex];
    handleSelectionForItem(resultItem);
  });

  /*
   * Show or hide the message in the search body.
   * Sets the content of the message if it is to be shown.
   */
  function toggleSearchMessage(bool, message) {
    if(bool) {
      if(message) {
        messageElem.textContent = message;
      }

      if(!messageElem.parentNode) {
        searchTemplateElem.appendChild(messageElem);
      }

      toggleModeButtons(false);
    } else {
      if(messageElem.parentNode) {
        searchTemplateElem.removeChild(messageElem);
      }

      toggleModeButtons(true);
    }
  }

  function toggleSearchSuggestions(bool) {
    if(bool) {
      if(!suggestionsElem.parentNode) {
        searchTemplateElem.appendChild(suggestionsElem);
      }

      toggleSearchMessage(false);
      toggleModeButtons(false);
    } else {
      if(suggestionsElem.parentNode) {
        searchTemplateElem.removeChild(suggestionsElem);
      }

      toggleModeButtons(true);
    }
  }

  function toggleDefaultResults(bool) {
    if(bool) {
      if(resultsContainerElem.parentNode) {
        resultsListElem.removeChild(resultsContainerElem);
        resultsListElem.appendChild(defaultResultsElem);
      }

      toggleSearchMessage(false);
      toggleSearchSuggestions(false);
      toggleModeButtons(false);
    } else {
      // Swap the default results out and the container in
      if(!resultsContainerElem.parentNode) {
        resultsListElem.removeChild(defaultResultsElem);
        resultsListElem.appendChild(resultsContainerElem);
      }

      toggleModeButtons(true);
    }
  }

  function toggleModeButtons(bool) {
    if(bool) {
      if(!separatorElem.parentNode) {
        searchTemplateElem.appendChild(separatorElem);
      }
    } else {
      if(separatorElem.parentNode) {
        searchTemplateElem.removeChild(separatorElem);
      }
    }
  }

  function setResultsMode(mode) {
    while(resultsListElem.firstChild) {
      resultsListElem.removeChild(resultsListElem.firstChild);
    }

    if(mode === "shelf")
      resultsContainerElem = resultsShelfContainerElem;
    if(mode === "grid")
      resultsContainerElem = resultsGridContainerElem;

    resultsListElem.appendChild(resultsContainerElem);
    resultsContainerElem.appendChild(resultsSectionElem);
  }

  function performSearchRequest() {
    const searchText = searchKeyboard.text.trim().replace(/\s+/g, " ");

    if(searchTextCache && searchText === searchTextCache) {
      return;
    }

    searchTextCache = searchText;

    if(searchRequest && searchRequest.readyState !== XMLHttpRequest.DONE) {
      searchRequest.abort();
    }

    if(searchText.length === 0) {
      toggleDefaultResults(true);
      return;
    }

    // Build the URL for the search query
    const searchParams = [
      `media=${searchMediaType}`,
      `limit=${searchResultsLimit}`,
      `term=${encodeURIComponent(searchText)}`
    ].join("&");

    const searchURL = searchBaseURL + searchParams;

    // Perform the search request
    searchRequest = new XMLHttpRequest();
    searchRequest.open("GET", searchURL);
    searchRequest.responseType = "json";
    searchRequest.onload = showSearchResponse;
    searchRequest.onerror = showSearchError;
    searchRequest.send();
  }

  /*
   * Show a generic error message in the search body
   */
  function showSearchError() {
    toggleSearchMessage(true, "An error occurred during your search.");
  }

  /*
   * Parse the XHR response and show the results or a message
   */
  function showSearchResponse() {
    toggleDefaultResults(false);
    toggleSearchSuggestions(false);
    clearSearchResults();

    // Show the results (or lack thereof)
    const searchResponse = searchRequest.response;
    const searchResults = searchResponse.results;

    if(searchResults.length > 0) {
      appendSearchResults(searchResults);
      toggleSearchMessage(false);
    } else {
      if(searchTextCache.length > 3) {
        toggleSearchMessage(true, `No results for ${searchTextCache}.`);
      } else {
        toggleSearchSuggestions(true);
      }
    }
  }

  /*
   * Empty the results cache and remove all results lockup elements.
   */
  function clearSearchResults() {
    searchResultsCache.length = 0;

    // Remove all existing search results
    while(resultsSectionElem.firstChild) {
      resultsSectionElem.removeChild(resultsSectionElem.firstChild);
    }
  }

  /*
   * Create lockup elements for the search results and cache
   * the data to be referenced by the selection handler.
   */
  function appendSearchResults(results) {
    const startIndex = searchResultsCache.length;

    // Create new lockups for the results
    results.forEach(function(item, index) {
      index += startIndex;

      const lockupElem = document.createElement("lockup");

      lockupElem.setAttribute("resultIndex", index);

      populateLockupWithItem(lockupElem, item);

      resultsSectionElem.appendChild(lockupElem);
      searchResultsCache.push(item);
    });
  }

  /*
   * Inserts elements containing data from a search result into the
   * empty lockup element created to display the result.
   * Shows an image, title, and subtitle in the lockup.
   */
  function populateLockupWithItem(lockupElem, item) {
    const imgElem = document.createElement("img");
    const titleElem = document.createElement("title");
    const titleText = searchMediaTitleFunc(item);
    const imgURL = searchMediaArtworkURLFunc(item);
    const imgWidth = searchMediaArtworkWidth;
    const imgHeight = imgWidth * searchMediaArtworkAspectRatio;

    // Set the lockup image attributes
    imgElem.setAttribute("src", imgURL);
    imgElem.setAttribute("width", imgWidth);
    imgElem.setAttribute("height", imgHeight);

    // Set the lockup element text from the item
    titleElem.setAttribute("class", "showTextOnHighlight");
    titleElem.textContent = titleText;

    // Put the child nodes into the lockup
    lockupElem.appendChild(imgElem);
    lockupElem.appendChild(titleElem);
  }

  /*
   * Called when a search result is selected, passing in the
   * JSON Object that was returned by the API for the result.
   */
  function handleSelectionForItem(item) {
    console.log("handleSelectionForItem: " + JSON.stringify(item));
    // TODO Something more interesting than logging
  }
};
