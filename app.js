// EmailJS 공개 설정: 대시보드의 Public Key, Service ID, Template ID를 한 곳에서 관리합니다.
const SITE_URL = "https://sso-ai.vercel.app/";
const EMAILJS_PUBLIC_KEY = "xpyplGwz47KscGj2A";
const EMAILJS_SERVICE_ID = "service_8w7ko4s";
const EMAILJS_TEMPLATE_ID = "template_0hju02w"; // 접수 알림
const EMAILJS_AUTOREPLY_ID = "template_3wu5k4n"; // 자동회신
const INQUIRY_RECEIVER_EMAIL = "kikii2202@gmail.com";

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: 0.12 });
revealItems.forEach((item) => observer.observe(item));

const numberObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (!entry.isIntersecting) return;
  entry.target.querySelectorAll('[data-count]').forEach((number) => {
    const target = Number(number.dataset.count); const suffix = target > 10 ? '+' : '년+'; const started = performance.now();
    const tick = (now) => { const progress = Math.min((now - started) / 1200, 1); const value = Math.floor((1 - Math.pow(1 - progress, 3)) * target); number.textContent = value.toLocaleString('ko-KR') + suffix; if (progress < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  numberObserver.unobserve(entry.target);
}), { threshold: 0.45 });
const numberSection = document.querySelector('.numbers');
if (numberSection) numberObserver.observe(numberSection);

const inquiryForm = document.querySelector(".inquiry-form");
if (inquiryForm) {
  const consent = inquiryForm.elements.privacy_agreed;
  const submitButton = inquiryForm.querySelector("button[type=submit]");
  const submitWrap = inquiryForm.querySelector(".submit-wrap");
  const formNote = inquiryForm.querySelector(".form-note");
  const privacyError = inquiryForm.querySelector(".privacy-error");
  const updateConsentState = () => {
    submitButton.disabled = !consent.checked;
    privacyError.hidden = true;
    if (!consent.checked) formNote.textContent = "개인정보 동의 후 문의를 전송할 수 있습니다.";
  };
  consent.addEventListener("change", updateConsentState);
  submitWrap?.addEventListener("pointerdown", () => {
    if (!consent.checked) {
      privacyError.hidden = false;
      formNote.textContent = "개인정보 수집 · 이용 동의해 주세요.";
    }
  });
  updateConsentState();
  inquiryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!consent.checked) { privacyError.hidden = false; formNote.textContent = "개인정보 수집 · 이용 동의해 주세요."; return; }
    if (!inquiryForm.checkValidity()) { inquiryForm.reportValidity(); return; }
    if (!window.emailjs) { formNote.textContent = "문의 전송 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."; return; }
    inquiryForm.elements.to_email.value = INQUIRY_RECEIVER_EMAIL;
    inquiryForm.elements.reply_to.value = inquiryForm.elements.from_email.value;
    inquiryForm.elements.submitted_at.value = new Intl.DateTimeFormat("ko-KR", { dateStyle: "full", timeStyle: "short" }).format(new Date());
    inquiryForm.elements.page_url.value = window.location.href;
    inquiryForm.elements.agreed_at.value = inquiryForm.elements.submitted_at.value;
    const templateParams = Object.fromEntries(new FormData(inquiryForm).entries());
    submitButton.disabled = true;
    formNote.textContent = "문의 내용을 전송하고 있습니다…";
    try {
      window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_ID, templateParams);
      inquiryForm.reset();
      updateConsentState();
      formNote.textContent = "문의가 정상적으로 접수되었습니다. 입력하신 이메일로 확인 메일을 보냈습니다.";
    } catch (error) {
      console.error("EmailJS 전송 실패:", error);
      submitButton.disabled = false;
      formNote.textContent = "전송에 실패했습니다. 잠시 후 다시 시도하거나 이메일로 문의해 주세요.";
    }
  });
}

const practiceVideos = document.querySelectorAll('.practice-video');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const syncPracticeVideos = () => practiceVideos.forEach((video) => {
  if (motionQuery.matches) { video.pause(); return; }
  const attempt = video.play();
  if (attempt) attempt.catch(() => video.pause());
});
syncPracticeVideos();
motionQuery.addEventListener?.('change', syncPracticeVideos);
