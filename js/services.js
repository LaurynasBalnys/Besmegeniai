document.addEventListener("DOMContentLoaded", () => {
  // Select all buttons inside the cards
  const buttons = document.querySelectorAll(".card .read-more-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");         
      const moreText = card.querySelector(".more-text"); 

      if (!moreText) return; 

      // Toggle show class
      moreText.classList.toggle("show");

      // Change button text accordingly
      btn.textContent = moreText.classList.contains("show") ? "Read Less" : "Read More";
    });
  });
});