/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$(document).ready(function () {
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };
 

  //Slide the new tweet box

  $("#arrow").click(function () {
    $(".new-tweet").slideDown();
  });
  const createTweetElement = function (tweet) {
    let $tweet = `
      <section class='tweet'>
  
    <article>
      <header>
        <div class='avatar'>
        <img src=${tweet.user.avatars}>
        <h3>${tweet.user.name}</h3>
        </div>
        <h4 id='username'>${tweet.user.handle}</h4>
      </header>
      <main>
              <p>
                ${escape(
      tweet.content.text.length > 60
        ? tweet.content.text.slice(0, 60) +
        "\n" +
        tweet.content.text.slice(60, tweet.content.text.length)
        : tweet.content.text
    )}
              </p>
            </main>
            <footer id='tweet-foot'>
              <div class='foot-content'>
              <p>${timeago.format(tweet.created_at)}</p>
              </div>
              <div id='icons'>
                <i class="fa-solid fa-flag"></i>
                <i class="fa-solid fa-repeat"></i>
                <i class="fa-solid fa-heart"></i>
              </div>
            </footer>
          </article>
          </section>`;
    return $tweet;
  };

  
  const renderTweets = function (arr) {
    const $container = $("#tweets-container"); // Select the container
    $container.empty(); // Clear existing tweets

    $.each(arr, (key) => {
      $container.prepend(createTweetElement(arr[key])); // Append each tweet
    });

    return $container;
  };

  //Submits form
  const $form = $(".textarea");

  $form.submit(function (event) {
    event.preventDefault();
    //cleans up any leftover error messages
    $("#empty").slideUp();
    $("#long-error").slideUp();

    //form validation checks
    const newTweetData = event.target[0].value.trim();
    if (!newTweetData) {
      $("#empty").slideDown();
      $(".new-tweet").slideDown();  // Show the .new.-tweet container
      return;
    }

    if (newTweetData.length > 140) {
      $("#long-error").slideDown();
      $(".new-tweet").slideDown();  // Show the .new-tweet container
      return;
    }

    $.ajax({
      method: "POST",
      url: "http://localhost:8080/tweets",
      data: $(this).serialize()
    }).then(function () {
      // Reset the textarea and tweet counter
      event.target[0].value = '';
      $(event.target).find('.counter').text('140');

      // Check if .new-tweet is not already visible
      if (!$(".new-tweet").is(":visible")) {
        // Show the .new-tweet container
        $(".new-tweet").slideDown();
      }

      // Load and display tweets again
      loadTweets();
    });
  });

  //fetching tweets from /tweets page
  
  const loadTweets = function () {
    $.ajax({
      method: "GET",
      url: "http://localhost:8080/tweets",
    }).then(function (tweet) {
      renderTweets(tweet);
      //resets the form

    });
  };
  loadTweets();
});
