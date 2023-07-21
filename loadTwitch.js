function loadTwitchVideo() {
  var twitchPlayer = null;

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
      // Set `withChat` to false to disable the chat display
      withChat: false,
      // Set `controls` to false to hide the player controls
      // Set `muted` to true to mute the video
      muted: false,
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