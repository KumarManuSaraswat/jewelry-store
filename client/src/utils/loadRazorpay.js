let pending;
export default function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true);
  if (pending) return pending;
  pending = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    const timer = setTimeout(() => finish(false), 20000);
    function finish(ok) {
      clearTimeout(timer);
      if (!ok) {
        script.remove();
        pending = undefined;
      }
      resolve(ok);
    }
    script.onload = () => finish(!!window.Razorpay);
    script.onerror = () => finish(false);
    document.body.appendChild(script);
  });
  return pending;
}
