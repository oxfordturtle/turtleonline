import React from "react";

export default (): JSX.Element => (
  <>
    <h3>Arithmetical Operators</h3>
    <p>The four main arithmetical operators are represented as:</p>
    <table className="help-table">
      <tbody>
        <tr>
          <td>
            <code data-language="Python">+</code>
          </td>
          <td>addition (also used for string concatenation)</td>
        </tr>
        <tr>
          <td>
            <code data-language="Python">-</code>
          </td>
          <td>subtraction</td>
        </tr>
        <tr>
          <td>
            <code data-language="Python">*</code>
          </td>
          <td>multiplication</td>
        </tr>
        <tr>
          <td>
            <code data-language="Python">//</code>
          </td>
          <td>division</td>
        </tr>
      </tbody>
    </table>
    <p>
      <code data-language="Python">//</code> is <em>integer</em> division, with
      the remainder discarded (e.g.{" "}
      <code data-language="Python">14 // 3 = 4</code>). Remainders are given by:
    </p>
    <table className="help-table">
      <tbody>
        <tr>
          <td>
            <code data-language="Python">mod</code>
          </td>
          <td>remainder</td>
        </tr>
      </tbody>
    </table>
    <p>
      (e.g. <code data-language="Python">14 mod 3 == 2</code>;{" "}
      <code data-language="Python">67 mod 10 == 7</code>).
    </p>

    <h3>Doing Fractional (e.g. Decimal) Arithmetic</h3>
    <p>
      The Turtle Machine is designed to handle memory simply and transparently
      for the learning of computer science, and so has no special type for
      representing fractional numbers; which is why{" "}
      <code data-language="Python">//</code> is integer division. But the Turtle
      System can handle fractional numbers by treating them explicitly as
      fractions, with both a numerator (above the line) and a denominator (below
      the line). A denominator of 1000000, for instance, allows decimal
      arithmetic to 6 decimal places.
    </p>
    <p>
      Thus to get the sine of 34.56 degrees to six decimal places, you could use{" "}
      <code data-language="Python">n = sin(3456, 100, 1000000)</code> – this
      makes <code data-language="Python">n</code> equal to the sine of the angle
      3456/100, multiplied by 1000000 (and rounded).{" "}
      <code data-language="Python">writeln(qstr(n, 1000000, 6))</code> will then
      print n/1000000 to six decimal places, i.e.{" "}
      <code data-language="Python">'0.567269'</code>. For more illustrations of
      this sort of decimal arithmetic, see the example program ‘Mathematical
      functions’.
    </p>

    <h3>Boolean Operators</h3>
    <p>The four main boolean operators are represented in the standard way:</p>
    <table className="help-table">
      <tbody>
        <tr>
          <td>
            <code data-language="Python">not</code>
          </td>
          <td>negation</td>
        </tr>
        <tr>
          <td>
            <code data-language="Python">and</code>
          </td>
          <td>conjunction</td>
        </tr>
        <tr>
          <td>
            <code data-language="Python">or</code>
          </td>
          <td>disjunction (inclusive)</td>
        </tr>
        <tr>
          <td>
            <code data-language="Python">xor</code>
          </td>
          <td>exclusive disjunction</td>
        </tr>
      </tbody>
    </table>
    <p>
      These can also be used between integers, in a <em>bitwise</em> fashion
      (i.e. each binary bit in the result is calculated as the result of the
      relevant boolean operation on the corresponding bits of the inputs), e.g.{" "}
      <code data-language="Python">21 and 6 = 4</code> (binary{" "}
      <code data-language="Python">10101 and 00110 = 100</code>);{" "}
      <code data-language="Python">21 or 6 = 23</code> (
      <code data-language="Python">10111</code>);{" "}
      <code data-language="Python">21 xor 6 = 19</code> (
      <code data-language="Python">10011</code>).
    </p>

    <h3>Comparison Operators</h3>
    <p>
      The six comparison operators are applicable to all types (with strings
      compared alphabetically):
    </p>
    <table className="help-table">
      <tbody>
        <tr>
          <td>
            <code data-language="Python">==</code>
          </td>
          <td>equality</td>
        </tr>
        <tr>
          <td>
            <code data-language="Python">!=</code>
          </td>
          <td>inequality</td>
        </tr>
        <tr>
          <td>
            <code data-language="Python">&lt;</code>
          </td>
          <td>less than</td>
        </tr>
        <tr>
          <td>
            <code data-language="Python">&lt;=</code>
          </td>
          <td>less than or equal</td>
        </tr>
        <tr>
          <td>
            <code data-language="Python">&gt;</code>
          </td>
          <td>greater than</td>
        </tr>
        <tr>
          <td>
            <code data-language="Python">&gt;=</code>
          </td>
          <td>greater than or equal</td>
        </tr>
      </tbody>
    </table>

    <h3>Bracketing</h3>
    <p>Complex expressions require brackets, e.g.</p>
    <pre>
      <code data-language="Python">
        if (n &lt; 0) or (n &gt; 9): n = ((a + 1) * (b + 3) + c) mod 10
      </code>
    </pre>
  </>
);
