import Link from 'next/link'
import { Imovel, formatPreco } from '@/lib/api'

export default function ImovelCard({ imovel, delay = 0 }: { imovel: Imovel; delay?: number }) {
  const foto = imovel.fotos?.[0] || 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200'

  return (
    <Link href={`/imoveis/${imovel.id}`} className="card fade-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="card-img">
        <img src={foto} alt={imovel.titulo} loading="lazy" />
        <div className="card-tags">
          <span className={`pill ${imovel.operacao === 'venda' ? 'pill-teal' : 'pill-gold'}`}>
            {imovel.operacao === 'venda' ? 'Venda' : 'Aluguel'}
          </span>
          {imovel.destaque && <span className="pill pill-soft">Destaque</span>}
        </div>
      </div>
      <div className="card-body">
        <div className="card-loc">{imovel.bairro} · {imovel.cidade}</div>
        <h3 className="card-title">{imovel.titulo}</h3>
        <div className="card-specs">
          <span>{imovel.quartos} quartos</span>
          <span className="sep">·</span>
          <span>{imovel.banheiros} banh.</span>
          <span className="sep">·</span>
          <span>{imovel.area_m2}m²</span>
        </div>
        <div className="card-price">{formatPreco(imovel.preco, imovel.operacao)}</div>
      </div>
      <style jsx>{`
        .card {
          display: flex;
          flex-direction: column;
          background: var(--cream);
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid var(--whisper);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.08);
          border-color: var(--teal-soft);
        }
        .card-img {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
          background: var(--ivory);
        }
        .card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .card:hover .card-img img { transform: scale(1.05); }
        .card-tags {
          position: absolute;
          top: 14px;
          left: 14px;
          display: flex;
          gap: 6px;
        }
        .card-body { padding: 20px; }
        .card-loc {
          font-size: 0.75rem;
          color: var(--stone);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }
        .card-title {
          font-size: 1.35rem;
          margin-bottom: 12px;
          color: var(--ink);
          line-height: 1.25;
        }
        .card-specs {
          color: var(--graphite);
          font-size: 0.85rem;
          margin-bottom: 14px;
          display: flex;
          gap: 8px;
        }
        .sep { color: var(--whisper); }
        .card-price {
          font-family: var(--font-display);
          font-size: 1.5rem;
          color: var(--teal-deep);
          font-weight: 500;
        }
      `}</style>
    </Link>
  )
}
