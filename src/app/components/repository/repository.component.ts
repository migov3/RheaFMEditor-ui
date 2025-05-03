import { Component } from '@angular/core';
import { FmRepositoryService } from '../../services/repository/fm-repository.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})
export class RepositoryComponent {
  features: any[] = [];
  displayedColumns: string[] = ['name', 'description', 'owner', 'valid', 'core', 'dead', 'variant', 'false-optional', 'configurations', 'doi', 'verified',  'delete_download'];
  role_id: number = 5;
  constructor(public dialog: MatDialog, private featureService: FmRepositoryService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.loadFeatures();
  }

  canAddFm(): boolean { // Logica en funcion del rol para poder añadir un FM
    return this.role_id <= 2;
  }

  canVerify(): boolean { // Logica en funcion del rol para verificar un FM
    return this.role_id <= 1;
  }

  canDelete(): boolean { // Logica en funcion del rol para borrar un FM
    return this.role_id <= 1;
  }

  handleRole(role: number) {
    this.role_id = role;
  }

  downloadFM(id: number, filename: string) {
    this.featureService.downloadFeature(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }, error: (error) => {
      console.error('Download error:', error);
    }});
  }

  loadFeatures(): void {
    this.featureService.getFeatures().subscribe({
      next: (data) => {
        this.features = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching features:', error);
      }
    });
  }

  addFeature(formData: FormData): void {
    this.featureService.addFeature(formData).subscribe({
      next: (data) => {
        this.loadFeatures();
        console.log(data);
      },
      error: (error) => {
        this.loadFeatures();
        console.error('Error adding feature:', error);
      }
    });
  }

  verifyFeature(id: number) {
    this.featureService.verifyFeature(id).subscribe({
      next: (data) => {
        console.log(data);
        this.loadFeatures();
      }, error: () => this.loadFeatures()
    })
  }

  deleteFeature(id: number): void {
    this.featureService.deleteFeature(id).subscribe({
      next: () => {
        this.features = this.features.filter(feature => feature.id !== id);
        this.loadFeatures();
      },
      error: (error) => {
        console.error('Error deleting feature:', error);
        this.loadFeatures();
      }
    });
  }

  openAddFm() {
    const dialog = this.dialog.open(AddFeatureModelDialog, {
        width: '650px'
    });

    dialog.afterClosed().subscribe((data) => {
      if (data) {
        this.addFeature(data);
      }
      console.log(data);
    })
  }

}

@Component({
  selector: 'dialog-add-feature',
  templateUrl: 'add-feature-dialog.html',
  styleUrls: ['repository.component.css']
})
export class AddFeatureModelDialog {
  
  addFm: FormGroup;
  selectedFile: File | null = null;

  constructor(public dialogRef: MatDialogRef<AddFeatureModelDialog>,
    private fb: FormBuilder,
    private authService: AuthenticationService) { 
      this.addFm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.maxLength(200)],
        doi: ['', Validators.maxLength(120)]
      });
    }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  addFeatureModel() {
    if (this.addFm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('name', this.addFm.controls['name'].value);
      formData.append('description', this.addFm.controls['description'].value);
      formData.append('doi', this.addFm.controls['doi'].value);
      formData.append('file', this.selectedFile, this.selectedFile.name);
      this.dialogRef.close(formData);
    }
  }
}