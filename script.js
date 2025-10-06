document.addEventListener("DOMContentLoaded", () => {
  // Dark mode functionality
  const body = document.getElementById("body");
  const scrollProgress = document.getElementById("scrollProgress");
  const sunIcon = document.getElementById("sunIcon");
  const moonIcon = document.getElementById("moonIcon");
  const themeColor = document.getElementById("theme-color");
  const colorScheme = document.getElementById("color-scheme");
  const statusBarStyle = document.getElementById("status-bar-style");

  // Check for saved theme preference or default to 'light'
  const currentTheme = localStorage.getItem("theme") || "light";

  // Apply the saved theme or ensure light mode is default
  if (currentTheme === "dark") {
    body.classList.add("dark");
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
    themeColor.setAttribute("content", "#0f172a");
    colorScheme.setAttribute("content", "dark");
    statusBarStyle.setAttribute("content", "light-content");
  } else {
    // Ensure light mode is properly set as default
    body.classList.remove("dark");
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
    themeColor.setAttribute("content", "#ffffff");
    colorScheme.setAttribute("content", "light");
    statusBarStyle.setAttribute("content", "dark-content");
    localStorage.setItem("theme", "light");
  }

  // Toggle dark mode function
  const toggleDarkMode = () => {
    if (body.classList.contains("dark")) {
      // Switch to light mode
      body.classList.remove("dark");
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
      themeColor.setAttribute("content", "#ffffff");
      colorScheme.setAttribute("content", "light");
      statusBarStyle.setAttribute("content", "dark-content");
      localStorage.setItem("theme", "light");
    } else {
      // Switch to dark mode
      body.classList.add("dark");
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
      themeColor.setAttribute("content", "#0f172a");
      colorScheme.setAttribute("content", "dark");
      statusBarStyle.setAttribute("content", "light-content");
      localStorage.setItem("theme", "dark");
    }
  };

  // Add click event to scroll progress circle
  scrollProgress.addEventListener("click", toggleDarkMode);

  gsap.registerPlugin(ScrollTrigger);

  // Animation helpers
  const animateReveal = (selector, from, to) => {
    gsap.utils.toArray(selector).forEach((el) =>
      gsap.fromTo(el, from, {
        ...to,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: false,
          toggleActions: "play none none reset",
        },
      })
    );
  };

  // Animations
  animateReveal(
    ".reveal-left",
    { x: -50, opacity: 0 },
    { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
  );
  animateReveal(
    ".reveal-right",
    { x: 50, opacity: 0 },
    { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
  );
  animateReveal(
    ".reveal-up",
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
  );
  animateReveal(
    ".reveal-down",
    { y: -50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
  );
  animateReveal(
    ".reveal-fade",
    { opacity: 0 },
    { opacity: 1, duration: 1.5, ease: "power2.out" }
  );

  // Refresh ScrollTriggers
  const refreshScrollTriggers = () => ScrollTrigger.refresh(true);
  window.addEventListener("resize", () =>
    setTimeout(refreshScrollTriggers, 100)
  );
  window.addEventListener("load", refreshScrollTriggers);

  // Animate counters and progress bars
  const animateCounters = () => {
    const counters = document.querySelectorAll(".counter-text");
    const progressBars = document.querySelectorAll(".progress-bar");

    counters.forEach((counter, index) => {
      const target = parseInt(counter.getAttribute("data-count"));
      const isPercentage = counter.textContent.includes("%");
      const hasPlus = counter.textContent.includes("+");
      const progressBar = progressBars[index];

      // Create the animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: counter,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Add counter animation to timeline
      tl.fromTo(
        counter,
        { textContent: 0 },
        {
          textContent: target,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          onUpdate: function () {
            const current = Math.ceil(this.targets()[0].textContent);
            if (isPercentage) {
              counter.textContent = current + "%";
            } else if (hasPlus) {
              counter.textContent = current + "+";
            } else {
              counter.textContent = current;
            }
          },
        }
      );

      // Add progress bar animation to timeline
      if (progressBar) {
        const width = progressBar.getAttribute("data-width");
        tl.to(
          progressBar,
          {
            width: width + "%",
            duration: 2,
            ease: "power2.out",
          },
          "-=1.8"
        ); // Start 0.2s after counter begins
      }
    });
  };

  // Initialize counter animations
  animateCounters();

  // Scroll to top button and progress circle
  const scrollBtn = document.getElementById("scrollTopBtn");
  const progressCircle = document.getElementById("progressCircle");

  window.addEventListener(
    "scroll",
    (() => {
      let last = 0;
      return () => {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        if (Math.abs(last - st) > 200) {
          last = st;
          refreshScrollTriggers();
        }

        // Update scroll progress circle
        const scrollHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (st / scrollHeight) * 100;
        const circumference = 113; // 2 * π * 18
        const offset = circumference - (scrolled / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;

        // Show/hide scroll to top button
        if (st > 300) {
          scrollBtn.classList.add("opacity-100", "visible");
          scrollBtn.classList.remove("opacity-0", "invisible");
        } else {
          scrollBtn.classList.remove("opacity-100", "visible");
          scrollBtn.classList.add("opacity-0", "invisible");
        }

        // Hide/show social media widget based on hero section
        const socialWidget = document.getElementById("socialMediaWidget");
        const heroSection = document.querySelector("section"); // First section is hero
        if (socialWidget && heroSection) {
          const heroHeight = heroSection.offsetHeight;
          if (st > heroHeight) {
            socialWidget.classList.add("opacity-0", "invisible");
            socialWidget.classList.remove("opacity-100", "visible");
          } else {
            socialWidget.classList.add("opacity-100", "visible");
            socialWidget.classList.remove("opacity-0", "invisible");
          }
        }
      };
    })(),
    { passive: true }
  );

  scrollBtn.addEventListener("click", () => {
    gsap.to(window, { duration: 1.5, scrollTo: 0, ease: "power4.inOut" });
  });

  // Footer year
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // Testimonials
  const testimonials = [
    {
      stars: "★★★★★",
      quote: `"Honestly, I loved the professionalism from this team"`,
      author: "Mr. Clinton Wright",
    },
    {
      stars: "★★★★★",
      quote: `"Kudos to the Axolotics team, great job done"`,
      author: "Mad. Cecilia Banks",
    },
    {
      stars: "★★★★★",
      quote: `"Had difficulty in automating task in our company, Axolotics helped me out"`,
      author: "Kweku Frimpong",
    },
  ];
  let testimonialIndex = 0,
    testimonialInterval;
  const testimonialBox = document.getElementById("testimonialBox");
  const testimonialStars = document.getElementById("testimonialStars");
  const testimonialQuote = document.getElementById("testimonialQuote");
  const testimonialAuthor = document.getElementById("testimonialAuthor");
  const testimonialDots = document.getElementById("testimonialDots");

  function renderTestimonialDots() {
    testimonialDots.innerHTML = "";
    testimonials.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Show testimonial ${idx + 1}`);
      dot.className = `w-3 h-3 rounded-full border transition-all duration-200 focus:outline-none${
        idx === testimonialIndex
          ? " bg-accent"
          : " bg-transparent hover:bg-accent/40"
      }`;
      if (idx === testimonialIndex) dot.setAttribute("aria-current", "true");
      dot.addEventListener("click", () => {
        testimonialIndex = idx;
        showTestimonial(idx);
        restartTestimonialRotation();
      });
      testimonialDots.appendChild(dot);
    });
  }
  function showTestimonial(idx) {
    testimonialStars.textContent = testimonials[idx].stars;
    testimonialQuote.textContent = testimonials[idx].quote;
    testimonialAuthor.textContent = testimonials[idx].author;
    renderTestimonialDots();
  }
  function startTestimonialRotation() {
    testimonialInterval = setInterval(() => {
      testimonialIndex = (testimonialIndex + 1) % testimonials.length;
      showTestimonial(testimonialIndex);
    }, 2000);
  }
  function stopTestimonialRotation() {
    clearInterval(testimonialInterval);
  }
  function restartTestimonialRotation() {
    stopTestimonialRotation();
    startTestimonialRotation();
  }
  testimonialBox.addEventListener("mouseenter", stopTestimonialRotation);
  testimonialBox.addEventListener("mouseleave", startTestimonialRotation);
  showTestimonial(testimonialIndex);
  startTestimonialRotation();

  // Mobile hamburger menu functionality
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  let isMobileMenuOpen = false;

  const toggleMobileMenu = () => {
    isMobileMenuOpen = !isMobileMenuOpen;

    if (isMobileMenuOpen) {
      mobileMenu.classList.add("mobile-menu-open");
      mobileMenuBtn.classList.add("hamburger-open");
      body.classList.add("menu-open");
    } else {
      mobileMenu.classList.remove("mobile-menu-open");
      mobileMenuBtn.classList.remove("hamburger-open");
      body.classList.remove("menu-open");
    }
  };

  // Toggle menu on hamburger button click
  mobileMenuBtn.addEventListener("click", toggleMobileMenu);

  // Close menu when clicking on mobile nav links
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (isMobileMenuOpen) {
        toggleMobileMenu();
      }
    });
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isMobileMenuOpen) {
      toggleMobileMenu();
    }
  });

  // Smooth scroll for nav links (both desktop and mobile)
  document
    .querySelectorAll('header nav a[href^="#"], .mobile-nav-link[href^="#"]')
    .forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          gsap.to(window, {
            duration: 1.1,
            scrollTo: { y: target, offsetY: 0 },
            ease: "power2.inOut",
          });
        }
      });
    });

  // Active nav link on scroll (both desktop and mobile)
  const navLinks = Array.from(
    document.querySelectorAll(
      'header nav a[href^="#"], .mobile-nav-link[href^="#"]'
    )
  );
  const sectionIds = navLinks
    .map((link) => link.getAttribute("href"))
    .filter(Boolean);
  const sections = sectionIds
    .map((id) => document.querySelector(id))
    .filter(Boolean);
  function setActiveLink(activeId) {
    navLinks.forEach((link) =>
      link.classList.toggle(
        "text-accent",
        link.getAttribute("href") === activeId
      )
    );
  }
  if ("IntersectionObserver" in window) {
    let currentActive = null;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) currentActive = "#" + entry.target.id;
        });
        if (currentActive) setActiveLink(currentActive);
      },
      { root: null, rootMargin: "0px 0px -60% 0px", threshold: 0.2 }
    );
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });
  }
});
