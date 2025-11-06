export default class SignatureUseCase {
  constructor(signatureRepository) {
    this.signatureRepository = signatureRepository;
  }

  async execute(idPedido, firmaBase64) {
    return await this.signatureRepository.signatureSaved(idPedido, firmaBase64);
  }
}
