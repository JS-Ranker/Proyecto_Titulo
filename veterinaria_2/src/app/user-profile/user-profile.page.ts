import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService, User } from '../services/auth.service';
import { DuenosService } from '../services/duenos.service';
import { MascotasService, Pet } from '../services/mascotas.service';
import { firstValueFrom } from 'rxjs';
import { IMG_BASE_URL } from '../services/api-config';

interface EditableField {
  isEditing: boolean;
  value: string;
  isUpdating: boolean;
  showSuccess: boolean;
  
}

interface PasswordField extends EditableField {
  showPassword: boolean;
  showConfirmPassword: boolean;
  confirmPassword: string;
  currentPassword: string;
  showCurrentPassword: boolean;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  standalone: false
})
export class UserProfilePage implements OnInit {
  userData: User | null = null;
  pets: Pet[] = [];
  loading = false;
  loadingPets = false;
  error = '';

  // Estados de edición para cada campo
  emailState: EditableField = {
    isEditing: false,
    value: '',
    isUpdating: false,
    showSuccess: false
  };

  telefonoState: EditableField = {
    isEditing: false,
    value: '',
    isUpdating: false,
    showSuccess: false
  };

  passwordState: PasswordField = {
    isEditing: false,
    value: '',
    isUpdating: false,
    showSuccess: false,
    showPassword: false,
    showConfirmPassword: false,
    confirmPassword: '',
    currentPassword: '',
    showCurrentPassword: false
  };

  constructor(
    private authService: AuthService,
    private duenosService: DuenosService,
    private mascotasService: MascotasService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadUserData();
    
    // Suscribirse a cambios en el usuario actual
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        console.log('Usuario desde AuthService:', user);
        this.userData = user;
        this.initializeEditStates();
      }
    });
  }

  async loadUserData() {
    console.log('Cargando datos del usuario...');
    
    // Primero intentar obtener datos del almacenamiento local
    const storedUser = this.authService.currentUserValue;
    console.log('Usuario almacenado:', storedUser);
    
    if (storedUser) {
      this.userData = storedUser;
      this.initializeEditStates();
      
      // Cargar mascotas del usuario
      await this.loadUserPets(storedUser.rut);
      return;
    }

    // Si no hay datos locales, obtener del servidor
    const userRut = this.authService.getCurrentUserRut();
    console.log('RUT del usuario:', userRut);
    
    if (!userRut) {
      this.error = 'No se encontró información del usuario';
      await this.showAlert('Error', 'No se encontró información del usuario. Por favor, inicie sesión nuevamente.');
      this.router.navigate(['/login']);
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Cargando perfil...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      this.loading = true;
      
      // Cargar datos del usuario desde el servidor
      console.log('Obteniendo datos del servidor para RUT:', userRut);
      const userResponse = await firstValueFrom(this.duenosService.obtenerDuenoPorRut(userRut));
      console.log('Respuesta del servidor:', userResponse);
      
      if (userResponse) {
        // Si la respuesta tiene estructura de API response
        this.userData = userResponse.data || userResponse;
        console.log('Datos del usuario cargados:', this.userData);
        
        // Actualizar el almacenamiento local y AuthService
        if (this.userData) {
          this.authService.updateCurrentUser(this.userData);
        }
        
        this.initializeEditStates();
        
        // Cargar mascotas del usuario después de cargar los datos del usuario
        await this.loadUserPets(userRut);
      }

      this.error = '';
    } catch (err: any) {
      console.error('Error loading user data:', err);
      this.error = err?.error?.error || 'Error al cargar los datos del usuario';
      await this.showAlert('Error', this.error);
    } finally {
      this.loading = false;
      await loading.dismiss();
    }
  }

  async loadUserPets(userRut: string) {
    try {
      this.loadingPets = true;
      console.log('Cargando mascotas para RUT:', userRut);
      
      const petsResponse = await firstValueFrom(this.mascotasService.obtenerMascotasPorDueno(userRut));
      console.log('Respuesta de mascotas:', petsResponse);
      
      // La respuesta del backend es directamente un array de mascotas
      if (petsResponse && Array.isArray(petsResponse)) {
        this.pets = petsResponse;
        console.log('Mascotas cargadas:', this.pets);
      } else {
        console.log('No se encontraron mascotas para este usuario');
        this.pets = [];
      }
    } catch (petsError: any) {
      console.log('Error al cargar las mascotas:', petsError);
      // No es un error crítico, continuamos sin las mascotas
      this.pets = [];
    } finally {
      this.loadingPets = false;
    }
  }

  private initializeEditStates() {
    if (this.userData) {
      this.emailState.value = this.userData.email || '';
      this.telefonoState.value = this.userData.telefono || '';
    }
  }

  // Métodos para editar email
  startEditingEmail() {
    this.emailState.isEditing = true;
    this.emailState.value = this.userData?.email || '';
  }

  cancelEmailEdit() {
    this.emailState.isEditing = false;
    this.emailState.value = this.userData?.email || '';
  }

  async saveEmail() {
    if (!this.userData || !this.emailState.value.trim()) {
      await this.showToast('El email no puede estar vacío', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.emailState.value)) {
      await this.showToast('Por favor ingrese un email válido', 'warning');
      return;
    }

    this.emailState.isUpdating = true;

    try {
      const response = await firstValueFrom(this.duenosService.actualizarEmail(this.userData.rut, this.emailState.value));
      if (response && response.data) {
        this.userData.email = this.emailState.value;
        this.emailState.isEditing = false;
        this.emailState.showSuccess = true;
        
        await this.showToast('Email actualizado correctamente', 'success');
        
        setTimeout(() => {
          this.emailState.showSuccess = false;
        }, 3000);
      }
    } catch (error: any) {
      console.error('Error updating email:', error);
      await this.showAlert('Error', error?.error?.error || 'Error al actualizar el email');
    } finally {
      this.emailState.isUpdating = false;
    }
  }

  // Métodos para editar teléfono
  startEditingTelefono() {
    this.telefonoState.isEditing = true;
    this.telefonoState.value = this.userData?.telefono || '';
  }

  cancelTelefonoEdit() {
    this.telefonoState.isEditing = false;
    this.telefonoState.value = this.userData?.telefono || '';
  }

  async saveTelefono() {
    if (!this.userData) return;

    this.telefonoState.isUpdating = true;

    try {
      const response = await firstValueFrom(this.duenosService.actualizarTelefono(this.userData.rut, this.telefonoState.value));
      if (response && response.data) {
        this.userData.telefono = this.telefonoState.value;
        this.telefonoState.isEditing = false;
        this.telefonoState.showSuccess = true;
        
        await this.showToast('Teléfono actualizado correctamente', 'success');
        
        setTimeout(() => {
          this.telefonoState.showSuccess = false;
        }, 3000);
      }
    } catch (error: any) {
      console.error('Error updating telefono:', error);
      await this.showAlert('Error', error?.error?.error || 'Error al actualizar el teléfono');
    } finally {
      this.telefonoState.isUpdating = false;
    }
  }

  // Métodos para editar contraseña
  startEditingPassword() {
    this.passwordState.isEditing = true;
    this.passwordState.value = '';
    this.passwordState.confirmPassword = '';
    this.passwordState.currentPassword = '';
  }

  cancelPasswordEdit() {
    this.passwordState.isEditing = false;
    this.passwordState.value = '';
    this.passwordState.confirmPassword = '';
    this.passwordState.currentPassword = '';
  }

  async savePassword() {
    if (!this.userData) return;

    if (!this.passwordState.currentPassword) {
      await this.showToast('La contraseña actual es requerida', 'warning');
      return;
    }

    if (this.passwordState.value.length < 6) {
      await this.showToast('La contraseña debe tener al menos 6 caracteres', 'warning');
      return;
    }

    if (this.passwordState.value !== this.passwordState.confirmPassword) {
      await this.showToast('Las contraseñas no coinciden', 'warning');
      return;
    }

    this.passwordState.isUpdating = true;

    try {
      const response = await firstValueFrom(this.duenosService.actualizarPassword(
        this.userData.rut, 
        this.passwordState.currentPassword, 
        this.passwordState.value
      ));
      
      if (response) {
        this.passwordState.isEditing = false;
        this.passwordState.showSuccess = true;
        this.passwordState.value = '';
        this.passwordState.confirmPassword = '';
        this.passwordState.currentPassword = '';
        
        await this.showToast('Contraseña actualizada correctamente', 'success');
        
        setTimeout(() => {
          this.passwordState.showSuccess = false;
        }, 3000);
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      await this.showAlert('Error', error?.error?.error || 'Error al actualizar la contraseña');
    } finally {
      this.passwordState.isUpdating = false;
    }
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    switch (field) {
      case 'current':
        this.passwordState.showCurrentPassword = !this.passwordState.showCurrentPassword;
        break;
      case 'new':
        this.passwordState.showPassword = !this.passwordState.showPassword;
        break;
      case 'confirm':
        this.passwordState.showConfirmPassword = !this.passwordState.showConfirmPassword;
        break;
    }
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  navigateToAddPet() {
    // TODO: Implementar navegación para agregar mascota cuando la página esté lista
    this.showToast('Función para agregar mascota próximamente disponible', 'primary');
  }

  navigateToPetDetail(pet: Pet) {
    if (pet.id_mascota) {
      this.router.navigate(['/mascotas-detalle', pet.id_mascota]);
    } else {
      this.showToast('Error: ID de mascota no encontrado', 'danger');
    }
  }

  navigateToAllPets() {
    this.router.navigate(['/mascotas-lista']);
  }

  // Navegar a video consulta
  navigateToVideoConsulta() {
    this.router.navigate(['/video-consulta']);
  }

  // Navegar a agendar cita
  navigateToAgendarCita() {
    this.router.navigate(['/agendar-cita']);
  }

  // Navegar a citas agendadas
  navigateToCitasAgendadas() {
    this.router.navigate(['/citas-agendadas']);
  }

  // Métodos auxiliares para formatear datos de mascotas
  getPetAge(fechaNacimiento?: string | null): string {
    if (!fechaNacimiento) return 'Edad no especificada';
    
    const birthDate = new Date(fechaNacimiento);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} año${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} mes${months > 1 ? 'es' : ''}`;
    } else {
      return `${diffDays} día${diffDays > 1 ? 's' : ''}`;
    }
  }

  getPetType(pet: Pet): string {
    if (pet.nombre_especie) {
      return pet.nombre_raza ? `${pet.nombre_especie} - ${pet.nombre_raza}` : pet.nombre_especie;
    }
    return 'Especie no especificada';
  }

  getPetWeight(peso?: number | null): string {
    return peso ? `${peso} kg` : 'Peso no registrado';
  }

  getPetSex(sexo?: string | null): string {
    if (!sexo) return 'No especificado';
    const sexoLower = sexo.toLowerCase();
    if (sexoLower === 'macho') return 'Macho';
    if (sexoLower === 'hembra') return 'Hembra';
    if (sexoLower === 'desconocido') return 'Desconocido';
    return sexo;
  }

  isPetSterilized(esterilizado?: boolean | number | null): string {
    if (esterilizado === undefined || esterilizado === null) return 'No especificado';
    return (esterilizado === true || esterilizado === 1) ? 'Esterilizado' : 'No esterilizado';
  }

  // TrackBy function para mejorar el rendimiento de la lista
  trackByPetId(index: number, pet: Pet): any {
    return pet.id_mascota || index;
  }

  refreshUserData() {
    // Actualizar desde localStorage
    const storedUser = this.authService.currentUserValue;
    if (storedUser) {
      this.userData = storedUser;
      this.initializeEditStates();
    }
  }

  ionViewWillEnter() {
    // Refrescar datos cuando la página se vuelve a mostrar
    this.refreshUserData();
  }

  getPetImageUrl(pet: Pet): string | null {
    if (!pet.url_imagen_mascota) return null;
    
    // Si ya es una URL completa, devolverla tal como está
    if (pet.url_imagen_mascota.startsWith('http')) {
      return pet.url_imagen_mascota;
    }
    
    // Si es una ruta relativa, agregar la URL base
    return `${IMG_BASE_URL}${pet.url_imagen_mascota}`;
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
      // Opcional: También podrías mostrar un ícono de fallback
      // const parent = target.parentElement;
      // if (parent) {
      //   parent.querySelector('ion-icon')?.setAttribute('style', 'display: block');
      // }
    }
  }
}
