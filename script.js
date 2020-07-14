const CORS_URL = 'https://cors-anywhere.herokuapp.com/';

//api endpoint (this is the url where we can make requests to in order to send or receive data)
const DATAMUSE_SEARCH_URL = CORS_URL + 'https://api.datamuse.com/words?ml=';
let wordResponseData = [];
let originalWordsArray = [];
let currentWordIndex = 0;


function getDataFromApi(searchTerm, callback) {
  //the query object gets translated into URL query parameters
  const query = {  
    rel_syn: `${searchTerm}`,
  }
  //jQuery.getJSON( url [, data ] [, success ] )
  //success is a callback function that is executed if the request succeeds
  $.getJSON(DATAMUSE_SEARCH_URL + searchTerm, callback);
}

function startButtonClick() {
  $('.appStart').on('click', '.startButton', event => {
    handleSubmit();
    $('.startButton').remove();
    $('.appStart').find('p').remove();
    $('.appStart').find('h1').remove();
    renderOriginalTweetForm();
    handleNextSynonym();
    handleKeepOriginalWord();
    });
}

function renderOriginalTweetForm() {
  $('.js-original-tweet-form').html(
    `<form role="form" class="og-tweet-form">
      <fieldset>
          <label id="og-tweet">Original Tweet</label>
          <textarea name="textfield" class="js-query" maxlength="280" rows="6"></textarea>
          <input type="submit" value="Search for Synonyms" class="js-submit-button">
      </fieldset>
    </form>`)
  }

function renderResult(word) {
  return `
    <label class="js-result-label" tabindex="0">${word}
      <input type="radio" name="synonym" value="${word}" class="js-radio-result">
      <span class="radio-button"></span>
    </label>
  `;
}

function handleSelectedRadio() {
  $('.js-results-container').on('change', 'input:radio', function(event) {
    $('.js-result-label').removeClass('checked');
    $(this).closest('.js-result-label').addClass('checked');

  });
}

//callback functions (we call to the api, and when we get the response back, the callback function runs)

function renderSynonym(type) {
  const words = wordResponseData
    .filter(wordObj => wordObj.hasOwnProperty('tags') && wordObj.tags.includes(type))
    .map(item => renderResult(item.word));

  $('.js-synonym-results').html(words)
  if(words.length < 1 || words == undefined) {
    $('.js-synonym-results').html(`<p>No synonyms found.</p>`);
  }
}

function handleClickShowNouns() {
  $('.js-nouns-container').click(event => {
    renderSynonym('n');
    $('.js-word-type-container').find('h3').removeClass('underline');
    $('.js-word-type-container').find('h3').removeClass('active');
    $('.js-nouns-container').find('h3').addClass('underline');
    $('.js-nouns-container').find('h3').addClass('active');
  })
}

function handleClickShowVerbs() {
  $('.js-verbs-container').click(event => {
    renderSynonym('v');
    $('.js-word-type-container').find('h3').removeClass('underline');
    $('.js-word-type-container').find('h3').removeClass('active');
    $('.js-verbs-container').find('h3').addClass('underline');
    $('.js-verbs-container').find('h3').addClass('active');
  })
}

function handleClickShowAdjectives() {
  $('.js-adjectives-container').click(event => {
    renderSynonym('adj');
    $('.js-word-type-container').find('h3').removeClass('underline');
    $('.js-word-type-container').find('h3').removeClass('active');
    $('.js-adjectives-container').find('h3').addClass('underline');
    $('.js-adjectives-container').find('h3').addClass('active');
  })
}

function handleClickShowAdverbs() {
  $('.js-adverbs-container').click(event => {
    renderSynonym('adv');
    $('.js-word-type-container').find('h3').removeClass('underline');
    $('.js-word-type-container').find('h3').removeClass('active');
    $('.js-adverbs-container').find('h3').addClass('underline');
    $('.js-adverbs-container').find('h3').addClass('active');
  })
}

//analyse the response data from the API & run callback functions
function parseResponse(data) {
  wordResponseData = data;
  handleClickShowNouns();
  handleClickShowVerbs();
  handleClickShowAdjectives();
  handleClickShowAdverbs();
}

function generateSynonymList() {
  if (currentWordIndex < originalWordsArray.length) {
    getDataFromApi(originalWordsArray[currentWordIndex], parseResponse);
  }
}

function createArray() {
  const inputData = $('.js-query').val();
  originalWordsArray = inputData.split(' ');
  generateSynonymList();
}

function generateHTMLNewSynonymResults() {
  return `
    <div class="js-new-synonym-results">
      <form role="form" class="tweet-string-form">
        <fieldset>
          <label id="tweet-string-label">New Tweet</label>
          <textarea name="textfield" class="tweet-string" maxlength="280" rows="6" readonly></textarea>
        </fieldset>
      </form>
    </div>`;
}

function generateResultsContainers() {
  return `
  <div class="row">
    <div class="col-3">
      <button class="js-word-type-container js-nouns-container">
        <h3 class="js-title">Nouns</h3>
      </button>
    </div>
    <div class="col-3">
      <button class="js-word-type-container js-verbs-container">
        <h3 class="js-title">Verbs</h3>
      </button>
    </div>
    <div class="col-3">
      <button class="js-word-type-container js-adjectives-container">
        <h3 class="js-title">Adjectives</h3>
      </button>
    </div>
    <div class="col-3">
      <button class="js-word-type-container js-adverbs-container">
        <h3 class="js-title">Adverbs</h3>
      </button>
    </div>
  </div>

  <div class="js-synonym-results">
    <form class="js-synonym-results-form"></form>
  </div>
  
  <div class="button-container js-next-synonym-button-container">
    <button class="js-next-synonym-button" type="button">Next Synonym</button>
  </div>
  <div class="button-container js-keep-original-button-container">
    <button class="js-keep-original-button" type="button">Keep Original Word</button>
  </div> 
  `
}

function handleSubmit(){
  $('.js-original-tweet-form').submit(event => {
    event.preventDefault();
    $('.js-results-container').html(`
      ${generateHTMLNewSynonymResults()}
      ${generateResultsContainers()}
    `);
    createArray();
    handleSelectedRadio();
    $('.js-original-tweet-form').find('.js-query').attr('readonly', true);
    });
  }


function handleNextSynonym() {
  $('.js-results-container').on('click', '.js-next-synonym-button', function(event) {
    const selectedSynonym = $('.js-synonym-results').find('input:checked').val();
    if(wordResponseData.length < 1 || wordResponseData == undefined || selectedSynonym == undefined) {
      return alert('Please select a synonym or choose the "Keep Original Word" button.');
    }
    else if(currentWordIndex < originalWordsArray.length - 1) {
      const selectedSynonym = $('.js-synonym-results').find('input:checked').val();
      const currentTweetString = $('.tweet-string').val() || '';
      $('.tweet-string').val(currentTweetString + ' ' + selectedSynonym);
      currentWordIndex++;
      $('.js-synonym-results').html('');
      generateSynonymList();
    }
    else {
      const selectedSynonym = $('.js-synonym-results').find('input:checked').val();
      const currentTweetString = $('.tweet-string').val() || '';
      $('.tweet-string').val(currentTweetString + ' ' + selectedSynonym);
      renderLastPage();
      $('html, body').animate({ scrollTop: 0 }, 'fast');
    }
  });
}

function handleKeepOriginalWord() {
  console.log('handleKeepOriginalWord works');
  $('.js-results-container').on('click', '.js-keep-original-button', function(event) {
    console.log('function inside handleKeepOriginalWord works');
    if(currentWordIndex < originalWordsArray.length - 1) {
      const originalWord = originalWordsArray[currentWordIndex];
      const currentTweetString = $('.tweet-string').val() || '';
      $('.tweet-string').val(currentTweetString + ' ' + originalWord);
      currentWordIndex++;
      $('.js-synonym-results').html('');
      generateSynonymList();
    }
    else {
      const originalWord = originalWordsArray[currentWordIndex];
      const currentTweetString = $('.tweet-string').val() || '';
      $('.tweet-string').val(currentTweetString + ' ' + originalWord);
      renderLastPage();
      $('html, body').animate({ scrollTop: 0 }, 'fast');
    }
  });
}

function renderLastPage() {
  console.log('renderLastPage works');
  const newTweet = $('.js-results-container').find('.tweet-string').val();
  $('.js-new-synonym-results').append(`
    <div class="final-buttons-wrapper">
      <a href="https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fpublish.twitter.com%2F%3FbuttonType%3DTweetButton%26buttonUrl%3Dno%26widget%3DButton&ref_src=twsrc%5Etfw&text=${newTweet}&tw_p=tweetbutton&url=no" class="twitter-share-button" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
      <input type="submit" value="Start Over" class="js-start-over-button">
    </div>
      `);
  disableButtons();
  handleStartOver();
}

function disableButtons() {
  $('.js-next-synonym-button-container').html(`<button class="js-next-synonym-button" type="button" disabled>Next Synonym</button>`);
  $('.js-keep-original-button-container').html(`<button class="js-keep-original-button" type="button" disabled>Keep Original Word</button>`);
}

function handleStartOver() {
  $('.js-new-synonym-results').on('click', '.js-start-over-button', function(event) {
    $('.js-results-container').html('');
    wordResponseData = [];
    originalWordsArray = [];
    currentWordIndex = 0;
    renderOriginalTweetForm();
  })
}

$(startButtonClick)