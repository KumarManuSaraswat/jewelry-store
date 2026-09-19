import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext";
export function render(pathname) {
  return renderToString(
    <StaticRouter location={pathname}>
      <CartProvider>
        <App />
      </CartProvider>
    </StaticRouter>,
  );
}
