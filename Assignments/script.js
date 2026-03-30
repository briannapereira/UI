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

//Assignment 4: API Connect
//Products from database
async function fetchAndRenderProducts() {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const products = await response.json();

    const cardsContainer = document.querySelector('.cards');
    if (!cardsContainer) return;
    cardsContainer.innerHTML = '';

    products.forEach((product) => {
      const article = document.createElement('article');
      article.classList.add('card');

      article.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <div class="card-body">
          <h3>${product.name}</h3>
          <p class="product-price">$${parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p>${product.description}</p>
          <button class="btn learn-more-btn">Learn More</button>
        </div>
      `;

      cardsContainer.appendChild(article);

      const btn = article.querySelector('.learn-more-btn');
      btn.addEventListener('click', () => {
        const cardBody = btn.closest('.card-body');
        let detailPara = cardBody.querySelector('.product-details');
        const isOpen   = detailPara && detailPara.style.display !== 'none';

        document.querySelectorAll('.learn-more-btn').forEach(b => {
          const p = b.closest('.card-body').querySelector('.product-details');
          if (p) p.style.display = 'none';
          b.textContent = 'Learn More';
        });

        if (isOpen) return;

        if (detailPara) {
          detailPara.style.display = '';
        } else {
          detailPara = document.createElement('p');
          detailPara.classList.add('product-details');
          detailPara.textContent = product.details;
          cardBody.insertBefore(detailPara, btn);
        }
        btn.textContent = 'Show Less';
      });
    });

  } catch (err) {
    console.warn('no products data:', err.message);
  }
}

//Company info from database
async function fetchCompanyInfo() {
  try {
    const response = await fetch('/api/company');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const company = await response.json();

    const aboutP = document.querySelector('#about p');
    if (aboutP && company.mission) aboutP.textContent = company.mission;

    //Footer contact info from DB
    const emailEl   = document.querySelector('.site-footer [aria-label="Contact information"] p:nth-child(2)');
    const phoneEl   = document.querySelector('.site-footer [aria-label="Contact information"] p:nth-child(3)');
    const addressEl = document.querySelector('.site-footer [aria-label="Contact information"] p:nth-child(4)');

    if (emailEl)   emailEl.innerHTML   = `<strong>Email:</strong> ${company.email}`;
    if (phoneEl)   phoneEl.innerHTML   = `<strong>Phone:</strong> ${company.phone}`;
    if (addressEl) addressEl.innerHTML = `<strong>Address:</strong> ${company.address}`;

  } catch (err) {
    console.warn('no company data:', err.message);
  }
}

fetchAndRenderProducts();
fetchCompanyInfo();