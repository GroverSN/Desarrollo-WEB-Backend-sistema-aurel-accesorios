import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario, LogAcceso } from '../entities';
import { RegisterDto, LoginDto } from './dtos/auth.dto';
import { validatePassword } from './password-validator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(LogAcceso)
    private logAccesoRepository: Repository<LogAcceso>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { nombre, email, password, captcha } = registerDto;

    // if (!captcha) {
    //   throw new BadRequestException('CAPTCHA es requerido');
    // }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new BadRequestException(passwordValidation.message);
    }

    const existingUser = await this.usuarioRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const usuario = this.usuarioRepository.create({
      nombre,
      email,
      password: hashedPassword,
      rol: 'admin',
      status: true,
    });

    await this.usuarioRepository.save(usuario);

    const token = this.jwtService.sign({ sub: usuario.id, email: usuario.email });

    return {
      message: 'Usuario registrado exitosamente',
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
      token,
      passwordStrength: passwordValidation.strength,
    };
  }

  async login(loginDto: LoginDto, ip: string, userAgent: string) {
    const { email, password, captcha } = loginDto;

    if (!captcha) {
      throw new BadRequestException('CAPTCHA es requerido');
    }

    const usuario = await this.usuarioRepository.findOne({ where: { email } });
    if (!usuario || !usuario.status) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = bcrypt.compareSync(password, usuario.password);
    if (!isPasswordValid) {
      await this.logAccess(usuario.id, ip, 'LOGIN_FAILED', userAgent);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    await this.logAccess(usuario.id, ip, 'LOGIN', userAgent);

    const token = this.jwtService.sign({ sub: usuario.id, email: usuario.email });

    return {
      message: 'Login exitoso',
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
      token,
    };
  }

  async getProfile(usuarioId: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
      select: ['id', 'nombre', 'email', 'rol', 'status', 'createdAt'],
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return usuario;
  }

  async checkPasswordStrength(password: string) {
    return validatePassword(password);
  }

  private async logAccess(usuarioId: number, ip: string, evento: string, browser: string) {
    const log = this.logAccesoRepository.create({
      usuarioId,
      ip,
      evento,
      browser,
    });
    await this.logAccesoRepository.save(log);
  }
}