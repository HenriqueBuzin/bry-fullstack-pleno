export class DocumentMaskUtil {

  static formatCpf(value: string): string {
    if (!value) return '';

    const v = value.replace(/\D/g, '').slice(0, 11);

    return v
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  static formatCnpj(value: string): string {
    if (!value) return '';

    const v = value.replace(/\D/g, '').slice(0, 14);

    return v
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  static clear(value: string): string {
    return value ? value.replace(/\D/g, '') : '';
  }
  
}
