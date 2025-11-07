import SignatureRepository from '../../domain/repositories/SignatureRepository';

export default class SignatureRepositoryImpl extends SignatureRepository {
  constructor() {
    super();
    this.apiSignatureBaseUrl = 'https://sistematortillasbackend-1.onrender.com/api/Pedidos/detalle/firmaporpedido';
  }

  async signatureSaved(id, firmaBase64) {
    try {
      const response = await fetch(this.apiSignatureBaseUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ id, firmaBase64}),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la firma');
      }

      const signatureData = await response.json();

      console.log('Firma guardada: ', signatureData);
      return signatureData;
    } catch (error) {
      throw new Error(error.message || 'Error al conectar con la API');
    }
  }
}
