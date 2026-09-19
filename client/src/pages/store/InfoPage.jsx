import { Link } from "react-router-dom";
import Icon from "../../components/Icon";
const content = {
  care: {
    eyebrow: "A LITTLE CARE, A LASTING LOVE",
    title: "Keep your sparkle.",
    intro:
      "A few small habits help keep your favorite pieces looking beautiful.",
    items: [
      [
        "Keep it dry",
        "Remove your jewelry before swimming, showering, or exercise. Moisture and chemicals can affect a plated finish.",
      ],
      [
        "The finishing touch",
        "Apply perfume, lotions, and cosmetics before putting on your jewelry. Let them dry first.",
      ],
      [
        "A soft touch",
        "Gently wipe your pieces with a soft, dry cloth after wearing. Avoid abrasive cleaners and polishing compounds.",
      ],
      [
        "A place of its own",
        "Store pieces separately in a soft pouch or a lined jewelry box to prevent scratches and tangles.",
      ],
      [
        "Find your fit",
        "For dimensions, ring sizing, or fit advice on a particular piece, contact our team before ordering.",
      ],
    ],
  },
  shipping: {
    eyebrow: "THE DETAILS THAT MATTER",
    title: "From us, to you.",
    intro: "Our shipping and returns promises, in one place.",
    items: [
      [
        "Shipping",
        "Shipping is complimentary on orders over ₹1,999. Orders of ₹1,999 or less have a ₹99 shipping charge. These amounts appear before you place your order.",
      ],
      [
        "Delivery updates",
        "Sign in to My Orders to follow your order from confirmation through processing, shipping, and delivery. Contact us with your order number for an estimated delivery date.",
      ],
      [
        "30-day easy returns",
        "Orniva offers 30-day easy returns. Contact our team with your order number to request a return and confirm the applicable conditions and return instructions before sending a piece back.",
      ],
      [
        "Payments",
        "Choose cash on delivery, or place an order and arrange payment directly with Orniva on WhatsApp. A WhatsApp order remains pending until our team confirms it.",
      ],
      [
        "An order needs a little help?",
        "For an address change, cancellation request, damaged piece, or delivery question, contact Orniva with your order number as soon as possible.",
      ],
    ],
  },
};
export default function InfoPage({ type }) {
  const page = content[type];
  return (
    <div className="page-shell">
      <div className="container content-narrow">
        <div className="info-intro">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </div>
        <div className="faq-list">
          {page.items.map(([title, text], i) => (
            <details key={title} open={i === 0}>
              <summary>{title}</summary>
              <p>{text}</p>
            </details>
          ))}
        </div>
        <div className="empty-state">
          <Icon name="heart" size={30} />
          <h3>We’re here for you.</h3>
          <p>Questions about a piece or an order? Let’s talk.</p>
          <Link to="/contact" className="btn-secondary">
            Contact Orniva
          </Link>
        </div>
      </div>
    </div>
  );
}
