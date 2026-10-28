/* Tienda con WhatsApp · definición de la app.
   Los datos de abajo (seed) son SOLO de ejemplo: se usan en "Modo demo" y en el botón
   "Cargar tienda de ejemplo" del panel. Tus datos reales viven en tu base de datos. */
(function () {
  const C = n => "c2000000-0000-4000-8000-00000000000" + n, I = n => "a2000000-0000-4000-8000-0000000000" + String(n).padStart(2, "0");
  const prod = (n, cat, nombre, descripcion, precio, foto, etiqueta) => ({ id: I(n), categoria_id: C(cat), nombre, descripcion, precio, foto: "img/" + foto + ".webp", etiqueta: etiqueta || "", disponible: true, orden: n });
  window.APP = {
    id: "tienda", prefix: "tda", bucket: "tda-imagenes", titulo: "Tienda", icono: "🛍️", ownerRpc: "tda_reclamar", seedVersion: 1,
    seed: {
      tda_ajustes: [{ id: 1, datos: {
        nombre: "Dulces Mary", lema: "Postres caseros hechos con cariño", ciudad: "Mérida, Venezuela",
        horario: "Lun a Sáb · 9:00 am – 7:00 pm", whatsapp: "584140000000", moneda: "$", prefijo: "T",
        portada: "img/hero-dulces.webp", logo: "", abierto: true,
        pagos: "Pago móvil, Transferencia, Efectivo, Zelle", delivery: true, retiro: true,
        nota_entrega: "Delivery en la ciudad. Te confirmamos el costo por WhatsApp."
      } }],
      tda_categorias: [
        { id: C(1), nombre: "Tortas", orden: 1, activo: true },
        { id: C(2), nombre: "Postres", orden: 2, activo: true },
        { id: C(3), nombre: "Para compartir", orden: 3, activo: true }],
      tda_productos: [
        prod(1, 1, "Torta de chocolate", "Bizcocho húmedo con ganache de cacao. 12 porciones.", 15, "torta", "Favorita"),
        prod(2, 1, "Torta tres leches", "Suave, bañada en tres leches y merengue.", 14, "tres-leches"),
        prod(3, 2, "Quesillo", "Receta tradicional con caramelo dorado.", 6, "quesillo", "Clásico"),
        prod(4, 2, "Marquesa de chocolate", "Capas de galleta, crema y chocolate.", 8, "marquesa"),
        prod(5, 3, "Cupcakes x6", "Con crema de chocolate batida.", 7, "cupcakes", "Nuevo"),
        prod(6, 3, "Galletas x12", "Con chispas de chocolate, recién horneadas.", 4, "galletas"),
        prod(7, 3, "Alfajores x6", "Rellenos de dulce de leche y coco rallado.", 5, "alfajores")],
      tda_pedidos: []
    },
    /* En modo demo imitamos lo que hace el servidor: precios reales y total recalculado */
    beforeInsert: {
      tda_pedidos(row, read) {
        const ps = read("tda_productos"); let tot = 0;
        row.items = row.items.map(it => { const p = ps.find(x => x.id === it.id && x.disponible); if (!p) throw new Error("Un producto del pedido ya no está disponible"); const q = Math.max(1, Math.min(50, it.cant | 0)); tot += p.precio * q; return { id: p.id, nombre: p.nombre, precio: p.precio, cant: q }; });
        row.total = Math.round(tot * 100) / 100; row.estado = "nuevo";
      }
    }
  };
})();
