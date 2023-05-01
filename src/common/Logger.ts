import kleur from "kleur";

export default class Logger {
  public static log = (args: any) => {
    const message = typeof args === "string" ? kleur.bold().white(args) : args;
    console.log(
      kleur.white(`[${new Date().toLocaleDateString()}][LOG] `),
      message
    );
  };
  public static info = (args: any) => {
    const message = typeof args === "string" ? kleur.bold().blue(args) : args;
    console.log(
      kleur.blue(`[${new Date().toLocaleDateString()}][INFO] `),
      message
    );
  };
  public static warn = (args: any) => {
    const message = typeof args === "string" ? kleur.bold().yellow(args) : args;
    console.log(
      kleur.yellow(`[${new Date().toLocaleDateString()}][WARN] `),
      message
    );
  };
  public static error = (args: any) => {
    const message = typeof args === "string" ? kleur.bold().red(args) : args;
    console.log(
      kleur.red(`[${new Date().toLocaleDateString()}][ERROR] `),
      message
    );
  };
}
