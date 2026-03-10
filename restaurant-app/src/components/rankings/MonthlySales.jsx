// =====================================================
// Componente: MonthlySales
// Archivo: src/components/rankings/MonthlySales.jsx
// Muestra el resumen de ventas mensuales del restaurante #1
// Pipeline: $match → $group por mes → $sort → $project
// =====================================================

function MonthlySales({ data, restauranteNombre }) {
  const MESES = [
    "", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];

  if (!data || data.length === 0) {
    return (
      <section>
        <h2 style={{ color: "var(--color-primary)", marginBottom: "1rem" }}>
          📊 Ventas mensuales
        </h2>
        <p style={{ color: "var(--color-muted)" }}>Sin datos disponibles.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 style={{ color: "var(--color-primary)", marginBottom: "0.25rem" }}>
        📊 Ventas mensuales
      </h2>
      <p style={{ color: "var(--color-muted)", marginBottom: "1rem", fontSize: "0.9rem" }}>
        Restaurante: <strong>{restauranteNombre}</strong>
      </p>

      <div style={{ display: "grid", gap: "0.75rem" }}>
        {data.map((row, index) => (
          <article
            key={index}
            style={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              padding: "1rem 1.25rem",
              boxShadow: "var(--shadow-soft)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {/* Mes y año */}
            <div>
              <h3 style={{ color: "var(--color-primary)", marginBottom: "0.2rem" }}>
                {MESES[row.mes]} {row.año}
              </h3>
              <p style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>
                {row.total_ordenes} órdenes · promedio Q{row.promedio_orden}
              </p>
            </div>

            {/* Total ventas */}
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--color-dark)" }}>
                Q{row.total_ventas}
              </p>
              <p style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>
                en ventas
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MonthlySales;