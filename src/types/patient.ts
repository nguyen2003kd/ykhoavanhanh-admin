export interface Patient {
    patientid: string;
    patientfirstname: string | null;
    patientlastname: string | null;
    patientnational: string | null;
    patientbirthday: string | null;
    patientbirthyear: string | null;
    patientsex: string | null;
    patientethnic: string | null;
    patientphonenumber: string | null;
    addressdetail: string | null;
    addressstreet: string | null;
    addressward: string | null;
    addresscity: string | null;
    addressprovince: string | null;
    addresscountry: string | null;
    professionid: string | null;
    updatetime: string | null;
    identifynumber: string | null;
    insurancenumber: string | null;
    insuranceexpireddate: string | null;
    idcardcode: string | null;
    patientethnicnname: string | null;
    addresswardname: string | null;
    addresscityname: string | null;
    addressprovincename: string | null;
    addresscountryname: string | null;
    professionname: string | null;
    addressfull: string | null;
    error: string | null;
  }
  
  export interface SearchPatientParams {
    ip?: string;
    idbv?: string;
    patientcode?: string;
    patientphonenumber?: string;
  }
  
  export interface CreatePatientPayload {
    patientid: string;
    patientfirstname: string;
    patientlastname: string;
    patientnational?: string;
    patientbirthday?: string;
    patientbirthyear?: string;
    patientsex?: string;
    patientethnic?: string;
    patientphonenumber?: string;
    addressdetail?: string;
    addressstreet?: string;
    addressward?: string;
    addresscity?: string;
    addressprovince?: string;
    addresscountry?: string;
    professionid?: string;
  }
  