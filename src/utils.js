import gradient from "gradient-string";
import figlet from "figlet";

export function renderTitle() {
  const figletConfig = {
    font: "Pagga",
    horizontalLayout: "fitted",
    verticalLayout: "fitted",
    whitespaceBreak: true,
  };

  const title = gradient(["gold", "crimson", "purple"])(
    figlet.textSync("Create Farcaster Miniapp", figletConfig)
  );

  console.log();
  console.log(title);
  console.log();
}
