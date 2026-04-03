(function () {
	const body = document.body;
	const themeToggle = document.getElementById("themeToggle");
	const menuButton = document.getElementById("menuButton");
	const siteNav = document.getElementById("siteNav");
	const modal = document.getElementById("projectModal");
	const closeModal = document.getElementById("closeModal");
	const modalTitle = document.getElementById("modalTitle");
	const modalStack = document.getElementById("modalStack");
	const modalDetail = document.getElementById("modalDetail");
	const aiSuggestBtn = document.getElementById("aiSuggestBtn");
	const aiOutput = document.getElementById("aiOutput");
	const contactForm = document.getElementById("contactForm");
	const formFeedback = document.getElementById("formFeedback");
	const chipContainer = document.getElementById("interestChips");

	const interactionStoreKey = "portfolioInteractions";
	const themeStoreKey = "portfolioTheme";

	const initialState = {
		clickedInterests: {},
		openedProjects: {}
	};

	const state = JSON.parse(localStorage.getItem(interactionStoreKey) || JSON.stringify(initialState));

	function saveState() {
		localStorage.setItem(interactionStoreKey, JSON.stringify(state));
	}

	function applyTheme(theme) {
		body.dataset.theme = theme;
		localStorage.setItem(themeStoreKey, theme);
		if (themeToggle) {
			themeToggle.textContent = theme === "dark" ? "Light" : "Dark";
		}
	}

	function initTheme() {
		const saved = localStorage.getItem(themeStoreKey);
		const preferredDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
		applyTheme(saved || (preferredDark ? "dark" : "light"));
	}

	function toggleMenu() {
		if (!siteNav) return;
		siteNav.classList.toggle("open");
	}

	function openProjectModal(project, stack, detail) {
		if (!modal || !modalTitle || !modalStack || !modalDetail) return;
		modalTitle.textContent = project;
		modalStack.textContent = `Stack: ${stack}`;
		modalDetail.textContent = detail;
		modal.showModal();

		state.openedProjects[project] = (state.openedProjects[project] || 0) + 1;
		saveState();
	}

	function attachProjectTriggers() {
		const cards = document.querySelectorAll("[data-project]");
		cards.forEach((card) => {
			const trigger = card.querySelector(".details-trigger") || card;
			trigger.addEventListener("click", () => {
				openProjectModal(card.dataset.project || "Project", card.dataset.stack || "Unknown", card.dataset.detail || "No details available.");
			});
		});
	}

	function initInterests() {
		if (!chipContainer) return;
		const chips = chipContainer.querySelectorAll(".chip");
		chips.forEach((chip) => {
			chip.addEventListener("click", () => {
				const key = chip.dataset.interest || chip.textContent.trim();
				state.clickedInterests[key] = (state.clickedInterests[key] || 0) + 1;
				chip.classList.toggle("active");
				saveState();
			});
		});
	}

	function suggestRecommendation() {
		const interests = Object.entries(state.clickedInterests);
		const projects = Object.entries(state.openedProjects);

		if (!interests.length && !projects.length) {
			return "Recommendation: Explore Daylight and tap an interest to personalize future suggestions.";
		}

		const topInterest = interests.sort((a, b) => b[1] - a[1])[0];
		const topProject = projects.sort((a, b) => b[1] - a[1])[0];

		if (topInterest && topInterest[0] === "Reading") {
			return "Recommendation: Start with the offline learning case study, then deepen with the Python + React learning path.";
		}

		if (topInterest && topInterest[0] === "Traveling") {
			return "Recommendation: Build a route-aware mobile PWA mini project and practice API integration patterns.";
		}

		if (topProject) {
			return `Recommendation: Since you explored ${topProject[0]} most, next try a portfolio piece focused on ${topProject[0]} performance tuning.`;
		}

		return "Recommendation: Continue with JavaScript UI architecture and state-driven components.";
	}

	function initAIRecommendation() {
		if (!aiSuggestBtn || !aiOutput) return;
		aiSuggestBtn.addEventListener("click", () => {
			aiOutput.textContent = suggestRecommendation();
		});
	}

	function initContactForm() {
		if (!contactForm || !formFeedback) return;

		contactForm.addEventListener("submit", (event) => {
			event.preventDefault();
			const formData = new FormData(contactForm);
			const fields = ["name", "email", "phone", "message"];
			const invalid = fields.some((field) => !String(formData.get(field) || "").trim());

			if (invalid) {
				formFeedback.textContent = "Please fill in all fields before sending.";
				formFeedback.style.color = "#762323";
				return;
			}

			formFeedback.textContent = "Message sent successfully. I will get back to you soon.";
			formFeedback.style.color = "#124921";
			contactForm.reset();
		});
	}

	function initRevealAnimation() {
		const elements = document.querySelectorAll(".reveal");
		if (!elements.length) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("visible");
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.1 }
		);

		elements.forEach((el) => observer.observe(el));
	}

	initTheme();
	initRevealAnimation();
	initInterests();
	initAIRecommendation();
	initContactForm();
	attachProjectTriggers();

	if (themeToggle) {
		themeToggle.addEventListener("click", () => {
			applyTheme(body.dataset.theme === "dark" ? "light" : "dark");
		});
	}

	if (menuButton) {
		menuButton.addEventListener("click", toggleMenu);
	}

	if (closeModal && modal) {
		closeModal.addEventListener("click", () => modal.close());
	}

	if (modal) {
		modal.addEventListener("click", (event) => {
			const bounds = modal.getBoundingClientRect();
			const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
			if (!inside) modal.close();
		});
	}
})();
