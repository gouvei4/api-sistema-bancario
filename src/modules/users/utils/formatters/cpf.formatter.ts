import { BadRequestException } from '@nestjs/common';

export class cpfFormatter {
  public static exec(cpf: string) {
    const onlyNumberCpf = cpf.replace(/\D/g, '');

    if (onlyNumberCpf.length !== 11) {
      throw new BadRequestException(`The CPF '${cpf}' is invalid`);
    }
    const formattedCpf = onlyNumberCpf.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4',
    );

    return formattedCpf;
  }
}
