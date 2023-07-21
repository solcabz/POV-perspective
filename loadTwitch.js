let twitchPlayer = null; // Variable to store the Twitch embed player instance

  function loadTwitchVideo() {
    var input = document.getElementById("urlTwitch");
    var videoUrl = input.value;
    var videoId = getVideoIdFromUrl(videoUrl);

    if (!twitchPlayer) {
      // If the Twitch player instance doesn't exist, create a new one
      twitchPlayer = new Twitch.Embed("twitch-embed", {
        width: 680,
        height: 420,
        video: videoId,
        autoplay: false,
        allowfullscreen: false,
        time: '',
      });
    } else {
      // If the Twitch player instance exists, update the video ID
      twitchPlayer.setVideo(videoId);
    }

    // Enable the "vodPerspective" div
    var vodPerspectiveDiv = document.querySelector(".vodPerspective");
    var inputField = vodPerspectiveDiv.querySelector(".urlTwitch");
    var generateButton = vodPerspectiveDiv.querySelector("button");
    inputField.disabled = false;
    generateButton.disabled = false;
  }

  function getVideoIdFromUrl(url) {
    var parts = url.split("/");
    var videoId = parts[parts.length - 1];
    return videoId;
  }