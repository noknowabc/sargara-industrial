(() => {
  const isKorean = document.documentElement.lang === "ko";
  const isChinese = document.documentElement.lang.startsWith("zh");
  const toggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const header = document.querySelector("[data-site-header]");
  const progress = document.querySelector("[data-progress]");

  const closeMenu = () => {
    if (!toggle || !mobileMenu) return;
    toggle.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      mobileMenu.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  document.querySelectorAll(".site-language").forEach((details) => {
    details.addEventListener("click", (event) => {
      if (event.target.closest("a")) details.removeAttribute("open");
    });
  });

  document.addEventListener("click", (event) => {
    if (!header || !mobileMenu?.classList.contains("is-open")) return;
    if (!header.contains(event.target)) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  document.querySelectorAll(".site-nav a").forEach((link) => {
    let linkPath = "";
    try {
      linkPath = new URL(link.getAttribute("href"), window.location.origin).pathname.replace(
        /\/+$/,
        ""
      );
    } catch {
      return;
    }
    if (
      linkPath !== "/" &&
      linkPath !== "/en" &&
      (path === linkPath || path.startsWith(`${linkPath}/`))
    ) {
      link.classList.add("is-active");
    }
  });

  const updateProgress = () => {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  const inquiryForm = document.querySelector("form#inquiry");
  if (inquiryForm) {
    const submit = inquiryForm.querySelector('button[type="submit"]');
    const status = document.createElement("p");
    status.className = "site-form-status";
    status.setAttribute("aria-live", "polite");
    submit?.insertAdjacentElement("afterend", status);

    const requestType = new URLSearchParams(window.location.search).get("request");
    const prefillMap = {
      drawing: isKorean
        ? "도면 또는 CAD 기반 맞춤 부품 요구사항"
        : isChinese
          ? "图纸或 CAD 定制部件需求"
        : "Custom drawing / CAD-based component requirement",
      sourcing: isKorean
        ? "소싱 목록, MRO 또는 복수 공급업체 요구사항"
        : isChinese
          ? "采购清单、MRO 或多供应商需求"
        : "Sourcing list, MRO or multi-supplier requirement",
      replacement: isKorean
        ? "교체 부품 번호 또는 명판 확인 요청"
        : isChinese
          ? "替换部件编号或铭牌核对需求"
        : "Replacement part number or nameplate request",
    };
    const requirement = inquiryForm.elements.namedItem("requirement");
    if (
      requirement instanceof HTMLInputElement &&
      !requirement.value &&
      prefillMap[requestType]
    ) {
      requirement.value = prefillMap[requestType];
    }

    inquiryForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!inquiryForm.checkValidity()) {
        inquiryForm.reportValidity();
        status.textContent = isKorean
          ? "계속하려면 필수 항목을 입력해 주세요."
          : isChinese
            ? "请填写必填项后继续。"
          : "Please complete the required fields before continuing.";
        return;
      }

      const data = new FormData(inquiryForm);
      const fieldLabels = isKorean
        ? {
            name: "이름",
            company: "회사",
            country: "국가",
            email: "이메일",
            whatsapp: "WhatsApp",
            quantity: "수량",
            targetMarket: "목표 시장",
            requirement: "제품 또는 소싱 요구사항",
            message: "메시지",
          }
        : isChinese
          ? {
              name: "姓名",
              company: "公司",
              country: "国家",
              email: "邮箱",
              whatsapp: "WhatsApp",
              quantity: "数量",
              targetMarket: "目标市场",
              requirement: "产品或采购需求",
              message: "留言",
            }
        : {
            name: "Name",
            company: "Company",
            country: "Country",
            email: "Email",
            whatsapp: "WhatsApp",
            quantity: "Quantity",
            targetMarket: "Target market",
            requirement: "Product or sourcing requirement",
            message: "Message",
          };
      const fields = [
        [fieldLabels.name, data.get("name")],
        [fieldLabels.company, data.get("company")],
        [fieldLabels.country, data.get("country")],
        [fieldLabels.email, data.get("email")],
        [fieldLabels.whatsapp, data.get("whatsapp")],
        [fieldLabels.quantity, data.get("quantity")],
        [fieldLabels.targetMarket, data.get("targetMarket")],
        [fieldLabels.requirement, data.get("requirement")],
        [fieldLabels.message, data.get("message")],
      ]
        .filter(([, value]) => String(value || "").trim())
        .map(([label, value]) => `${label}: ${String(value).trim()}`)
        .join("\n");
      const message = [
        isKorean
          ? "안녕하세요 David, 산업 요구사항을 상담하고 싶습니다."
          : isChinese
            ? "您好 David，我希望咨询一项工业需求。"
          : "Hello David, I would like to discuss this industrial requirement.",
        "",
        fields,
      ].join("\n");
      const whatsappUrl = `https://wa.me/8618868685020?text=${encodeURIComponent(
        message
      )}`;
      const opened = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      if (opened) {
        status.textContent = isKorean
          ? "문의 내용과 함께 WhatsApp이 열립니다. 채팅에서 도면이나 사진을 첨부해 주세요."
          : isChinese
            ? "WhatsApp 将带着您的询价信息打开，请在聊天中附上图纸或照片。"
          : "WhatsApp is opening with your inquiry. Attach drawings or photos in the chat.";
      } else {
        status.textContent = isKorean
          ? "브라우저가 새 창을 차단했습니다. WhatsApp으로 바로 이동합니다."
          : isChinese
            ? "浏览器阻止了新窗口，正在直接打开 WhatsApp。"
          : "Your browser blocked the new window. Opening WhatsApp directly.";
        window.location.href = whatsappUrl;
      }
    });
  }
})();
