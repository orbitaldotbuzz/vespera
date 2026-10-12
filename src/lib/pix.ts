// ============================================================
// VÉSPERA — gerador de payload PIX (copia-e-cola)
// ------------------------------------------------------------
// Monta um payload no formato EMV QR Code MPM (BR Code) do Banco
// Central, com CRC16-CCITT válido. Chave PIX fictícia de exemplo
// (ambiente de portfólio — nenhum pagamento real é processado).
// ============================================================

const ID_PAYLOAD = "00";
const ID_MERCHANT = "26";
const ID_MERCHANT_GUI = "00";
const ID_MERCHANT_CHAVE = "01";
const ID_MCC = "52";
const ID_MOEDA = "53";
const ID_VALOR = "54";
const ID_PAIS = "58";
const ID_NOME = "59";
const ID_CIDADE = "60";
const ID_ADICIONAL = "62";
const ID_ADICIONAL_TXID = "05";
const ID_CRC = "63";

/** t = tamanho do campo em 2 dígitos + conteúdo */
function campo(id: string, valor: string): string {
  return `${id}${valor.length.toString().padStart(2, "0")}${valor}`;
}

/** CRC16-CCITT (poly 0x1021, init 0xFFFF) — exigido pelo BR Code */
function crc16(payload: string): string {
  let crc = 0xffff;
  for (const byte of Buffer.from(payload, "utf8")) {
    crc ^= byte << 8;
    for (let i = 0; i < 8; i++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

interface PixParams {
  chave: string; // chave PIX (fictícia)
  nome: string; // nome do recebedor (máx 25)
  cidade: string; // cidade (máx 15)
  valor: number; // em centavos
  txid: string; // identificador do pedido (alfanumérico, máx 25)
}

export function gerarPixCopiaECola({ chave, nome, cidade, valor, txid }: PixParams): string {
  const gui = campo(ID_MERCHANT_GUI, "br.gov.bcb.pix");
  const chaveField = campo(ID_MERCHANT_CHAVE, chave.slice(0, 77));
  const merchant = campo(ID_MERCHANT, `${gui}${chaveField}`);

  const parte1 =
    campo(ID_PAYLOAD, "01") +
    merchant +
    campo(ID_MCC, "0000") +
    campo(ID_MOEDA, "986") +
    campo(ID_VALOR, (valor / 100).toFixed(2)) +
    campo(ID_PAIS, "BR") +
    campo(ID_NOME, nome.slice(0, 25).toUpperCase()) +
    campo(ID_CIDADE, cidade.slice(0, 15).toUpperCase()) +
    campo(ID_ADICIONAL, campo(ID_ADICIONAL_TXID, txid.slice(0, 25).replace(/[^a-zA-Z0-9]/g, "").toUpperCase() || "VESPERA"));

  const comCrcId = `${parte1}${ID_CRC}04`;
  return `${comCrcId}${crc16(comCrcId)}`;
}
