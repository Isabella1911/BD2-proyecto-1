function PaymentInfo({ method }) {
  return (
    <section
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-lg)",
        padding: "1.5rem",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <h2 style={{ color: "var(--color-primary)", marginBottom: "1rem" }}>
        Pago
      </h2>

      <p>
        <strong>Método de pago:</strong> {method}
      </p>
    </section>
  );
}

export default PaymentInfo;