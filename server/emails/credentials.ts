import type { User } from "../types.ts";

export default (user: User): string => `
  <p>Dear ${user.firstName} ${user.lastName},</p>
  <p>Your username for <a href="https://www.turtle.ox.ac.uk">www.turtle.ox.ac.uk</a> is: <strong>${
    user.username
  }</strong>. Please click on the button below to reset your password.</p>
  <div class="button">
    <a href="${
      prod ? "https://www.turtle.ox.ac.uk" : "http://localhost:8000"
    }/reset/${user.username}/${user.token}">Reset My Password</a>
  </div>
  <p>(You have received this email because someone entered your email address into the Forgotten Credentials form on our site. If this wasn't you, you can safely ignore this message. No one else will see the link to reset your password, and the link will only remain active for 24 hours.)</p>
  <br>
  <p>Happy Turtling!</p>
  <p>The Oxford Turtle Robot</p>
`;

const prod = Deno.env.get("prod") === "true";
