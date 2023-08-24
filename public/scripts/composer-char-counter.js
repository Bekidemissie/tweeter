$(document).ready(function () {
    $("#tweet-text").keyup(function () {
      let charCount = $(this).val().length
      let counterValue = 140
      let currentValue = counterValue - charCount
      $('.counter').text(currentValue).toggleClass('warning', currentValue < 0)
     
    })
  })