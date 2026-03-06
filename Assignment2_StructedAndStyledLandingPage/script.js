//Javascript sheet

//Step 2: Interactive Navigation Bar

const nav    = document.querySelector('.site-nav');
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {

  if (window.scrollY > header.offsetHeight) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }

  highlightActiveNavLink();
});

//Highlighting the header functions
function highlightActiveNavLink() {
  const sectionIds = ['top', 'about', 'products', 'services', 'contact'];
  const navLinks   = document.querySelectorAll('.nav-link');

  let currentId = 'top';

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    if (el.getBoundingClientRect().top <= window.innerHeight / 2) {
      currentId = id;
    }
  });

   navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });
}

highlightActiveNavLink();


//Step 3: Show/Hide Introductory Paragraph

const introPara = document.querySelector('.hero-text p:not(.lead)');

const toggleBtn       = document.createElement('button');
toggleBtn.id          = 'toggle-intro-btn';
toggleBtn.textContent = 'Hide Intro';
toggleBtn.setAttribute('aria-expanded', 'true');
introPara.insertAdjacentElement('afterend', toggleBtn);

toggleBtn.addEventListener('click', () => {
  const isVisible = introPara.style.display !== 'none';

  if (isVisible) {
    introPara.style.display = 'none';
    toggleBtn.textContent   = 'Show Intro';
    toggleBtn.setAttribute('aria-expanded', 'false');
  } else {
    introPara.style.display = '';
    toggleBtn.textContent   = 'Hide Intro';
    toggleBtn.setAttribute('aria-expanded', 'true');
  }
});


//Step 4: Product Highlights Interaction

//Learn more product details
const productDetails = [
 "The Solar Roof Kit includes efficient panels, mounting hardware, and energy-saving technology designed for home use.",
 "Eco Battery Storage stores extra solar energy for later use, providing backup power and reduce dependency on the grid.",
 "The Smart Energy Monitor gives real-time usage insights, helping customers track consumption and lower monthly energy costs."
];

const learnMoreBtns = document.querySelectorAll('.card .btn');

learnMoreBtns.forEach((btn, index) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault(); 

    const cardBody   = btn.closest('.card-body');
    let   detailPara = cardBody.querySelector('.product-details');
    const isAlreadyOpen = detailPara && detailPara.style.display !== 'none';

    //Expand one card at a time
    learnMoreBtns.forEach((otherBtn) => {
      const otherPara = otherBtn.closest('.card-body').querySelector('.product-details');
      if (otherPara) otherPara.style.display = 'none';
      otherBtn.textContent = 'Learn More';
    });

    if (isAlreadyOpen) {
      return;

    } else if (detailPara) {
      detailPara.style.display = '';
      btn.textContent          = 'Show Less';

    } else {
      detailPara             = document.createElement('p');
      detailPara.classList.add('product-details');
      detailPara.textContent = productDetails[index];

      cardBody.appendChild(detailPara);
      cardBody.insertBefore(detailPara, btn);
      btn.textContent = 'Show Less';
    }
  });
});

//Step 5: Footer Dynamic Year

const footerCopy = document.querySelector('.footer-bottom p');
if (footerCopy) {
  const year = new Date().getFullYear();
  footerCopy.textContent = `© ${year} GreenTech Solutions. All rights reserved.`;
}