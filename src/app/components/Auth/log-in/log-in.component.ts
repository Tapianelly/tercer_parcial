import {Component, inject} from '@angular/core';
import {ButtonsComponent} from "../components/buttons/buttons.component";
import {Router, RouterLink} from "@angular/router";
import {ContainerComponent} from "../components/container/container.component";
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { ReactiveFormsModule } from "@angular/forms"
import {AuthServiceService} from "@app/core/services/auth/auth.service.service";
import { Credentials } from '@/types';
import { ButtonProviders } from '../components/button-providers/button-providers.component';


@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    ButtonsComponent,
    RouterLink,
    ContainerComponent,
    ReactiveFormsModule,
    ButtonProviders
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  private readonly auth = inject(AuthServiceService)
  private readonly router = inject(Router)

  protected formControl;
  showPassword: boolean = false;
  constructor() {
    this.formControl = new FormGroup({
      email: new FormControl('cademi4911@jadsys.com', [
        Validators.required,
        Validators.email
      ]),
      role: new FormControl<"Admin" | "Client">('Client', [
        Validators.required,
        Validators.pattern(/Admin|Client/)
      ]),
      password: new FormControl('n8pnU9xrVAjJz*', [
        Validators.required,
        Validators.minLength(8)
      ])
    })
  }

  async onSubmit() {
    if (!this.formControl.valid) return
    try {
      const data = this.formControl.value

      const user = {
        email: data.email,
        password: data.password,
        role: data.role
      } as Credentials
      const res = await this.auth.login(user)
      if(res.user){
        await this.router.navigateByUrl('/dashboard/gallery')
      }
      else{
        alert('Invalid credentials')
      }
    }catch (e) {
      if (e instanceof Error) {
        console.error(e.message)
      }
    }
  }
}
