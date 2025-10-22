'use client';

import Input from "@/components/Input";
import Select, { SelectOption } from "@/components/Select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { RegisterFormData, createRegisterSchema } from "../schema/register.schema";
import Link from "@/components/Link";
import { registerDoctor, createRegisterDoctorRequest, type DoctorRegistrationResult } from "../services/register.service";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { useRegistrationStore } from "@/lib/stores/registration.store";

const RegisterForm = () => {
    const t = useTranslations("portal-medico.register");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const markRegistrationSuccessful = useRegistrationStore((state) => state.markRegistrationSuccessful);
    const router = useRouter();
    
    const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>({
        resolver: zodResolver(createRegisterSchema(t)),
        defaultValues: {
            termsAndConditions: false,
            workPlaces: [],
            yearsOfExperience: 0,
            licenseType: "",
            speciality: "",
            exequatur: "",
            password: "",
            confirmPassword: "",
            email: "",
            name: "",
            lastName: "",
            phone: "",
        },
    });

    // Options for license type select
    const licenseTypeOptions: SelectOption[] = [
        { value: "general", label: t("license-type-general") },
        { value: "specialist", label: t("license-type-specialist") },
        { value: "resident", label: t("license-type-resident") },
        { value: "intern", label: t("license-type-intern") },
    ];

    // Options for speciality select
    const specialityOptions: SelectOption[] = [
        { value: "cardiology", label: t("speciality-cardiology") },
        { value: "dermatology", label: t("speciality-dermatology") },
        { value: "endocrinology", label: t("speciality-endocrinology") },
        { value: "gastroenterology", label: t("speciality-gastroenterology") },
        { value: "internal-medicine", label: t("speciality-internal-medicine") },
        { value: "neurology", label: t("speciality-neurology") },
        { value: "oncology", label: t("speciality-oncology") },
        { value: "pediatrics", label: t("speciality-pediatrics") },
        { value: "psychiatry", label: t("speciality-psychiatry") },
        { value: "radiology", label: t("speciality-radiology") },
        { value: "surgery", label: t("speciality-surgery") },
        { value: "other", label: t("speciality-other") },
    ];

    /**
     * Handles form submission with proper error handling and loading states
     * @param data - Form data validated by Zod
     */
    const onSubmit = async (data: RegisterFormData) => {
        if (isSubmitting) return; // Prevent double submission
        
        setIsSubmitting(true);
        setApiError(null); // Clear previous errors
        
        try {
            const request = createRegisterDoctorRequest({
                name: data.name,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                password: data.password,
                exequatur: data.exequatur,
            });

            const result: DoctorRegistrationResult = await registerDoctor(request);

            if (result.success) {
                // Mark registration as successful and store user email
                markRegistrationSuccessful(data.email);
                // Redirect to success page with i18n support
                router.push({ pathname: '/portal-medico/registro-exitoso' });
            } else {
                // Handle different types of errors
                let errorMessage = result.errorMessage || t('registration-failed');
                
                if (result.failedStep === 'exequatur-validation') {
                    errorMessage = t('exequatur-validation-failed') + ': ' + (result.errorMessage || '');
                } else if (result.failedStep === 'name-mismatch') {
                    errorMessage = t('name-mismatch-error');
                } else if (result.failedStep === 'registration') {
                    errorMessage = t('registration-failed') + ': ' + (result.errorMessage || '');
                }
                
                setApiError(errorMessage);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t('unexpected-error');
            setApiError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
       <form id="registerForm" className="space-y-8" noValidate onSubmit={handleSubmit(onSubmit)}>
            {/* Personal Information */}
            <section>
                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{t("personal-information-title")}</h2>
                    <p className="text-gray-600 text-sm">{t("personal-information-description")}</p>
                </div>  

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label={t("name")}
                        type="text"
                        placeholder={t("name-placeholder")}
                        required
                        registration={register("name")}
                        error={errors.name?.message}
                        autoComplete="name"
                        disabled={isSubmitting}
                    />

                    <Input
                        label={t("last-name")}
                        type="text"
                        placeholder={t("last-name-placeholder")}
                        required
                        registration={register("lastName")}
                        error={errors.lastName?.message}
                        autoComplete="family-name"
                        disabled={isSubmitting}
                    />

                    <Input
                        label={t("email")}
                        type="email"
                        placeholder={t("email-placeholder")}
                        required
                        registration={register("email")}
                        error={errors.email?.message}
                        autoComplete="email"
                        disabled={isSubmitting}
                    />

                    <Input
                        label={t("phone")}
                        type="tel"
                        placeholder={t("phone-placeholder")}
                        required
                        registration={register("phone")}
                        error={errors.phone?.message}
                        autoComplete="tel"
                        disabled={isSubmitting}
                    />

                    <Input
                        label={t("password")}
                        type="password"
                        placeholder={t("password-placeholder")}
                        required
                        registration={register("password")}
                        error={errors.password?.message}
                        helperText={t("password-helper-text")}
                        disabled={isSubmitting}
                    />

                    <Input
                        label={t("confirm-password")}
                        type="password"
                        placeholder={t("confirm-password-placeholder")}
                        required
                        registration={register("confirmPassword")}
                        error={errors.confirmPassword?.message}
                        disabled={isSubmitting}
                    />
                </div>
            </section>

            <section className="border-t border-gray-200 pt-8">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{t("professional-information-title")}</h2>
                    <p className="text-gray-600 text-sm">{t("professional-information-description")}</p>
                </div>  

                {/* Professional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                        label={t("exequatur")} 
                        type="text" 
                        placeholder={t("exequatur-placeholder")} 
                        required 
                        registration={register("exequatur")} 
                        error={errors.exequatur?.message} 
                        disabled={isSubmitting}
                    />

                    <Select 
                        label={t("license-type")} 
                        placeholder={t("license-type-placeholder")} 
                        required 
                        registration={register("licenseType")} 
                        error={errors.licenseType?.message}
                        options={licenseTypeOptions}
                        name="licenseType"
                        value={watch("licenseType") || ""}
                    />

                    <Select
                        label={t("speciality")}
                        placeholder={t("speciality-placeholder")}
                        required
                        registration={register("speciality")}
                        error={errors.speciality?.message}
                        options={specialityOptions}
                        name="speciality"
                        value={watch("speciality") || ""}
                    />

                    <Input
                        label={t("years-of-experience")}
                        type="number"
                        min={0}
                        placeholder={t("years-of-experience-placeholder")}
                        registration={register("yearsOfExperience", { 
                            setValueAs: (value) => value === "" ? undefined : Number(value)
                        })}
                        error={errors.yearsOfExperience?.message}
                        disabled={isSubmitting}
                    />
                </div>
            </section>

            <section className="border-t border-gray-200 pt-8">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{t("work-places-title")}</h2>
                    <p className="text-gray-600 text-sm">{t("work-places-description")}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 px-1">
                        {t("medical-institutions")} <span className="text-red-500" aria-label="required field">*</span>
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded transition-colors duration-150">
                                <Input 
                                    type="checkbox"
                                    id="workplace_1"
                                    name="workPlaces"
                                    value="Hospital_Central"
                                    registration={register("workPlaces")}
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="workplace_1" className="text-sm text-gray-700 cursor-pointer flex-1">
                                    {t("hospital-central")}
                                </label>
                            </div>
                            <div className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded transition-colors duration-150">
                                <Input 
                                    type="checkbox"
                                    id="workplace_2"
                                    name="workPlaces"
                                    value="Clinica_ABC"
                                    registration={register("workPlaces")}
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="workplace_2" className="text-sm text-gray-700 cursor-pointer flex-1">
                                    {t("clinic-abc")}
                                </label>
                            </div>
                            <div className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded transition-colors duration-150">
                                <Input 
                                    type="checkbox"
                                    id="workplace_3"
                                    name="workPlaces"
                                    value="Centro_Medico_Norte"
                                    registration={register("workPlaces")}
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="workplace_3" className="text-sm text-gray-700 cursor-pointer flex-1">
                                    {t("medical-center-north")}
                                </label>
                            </div>
                            <div className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded transition-colors duration-150">
                                <Input 
                                    type="checkbox"
                                    id="workplace_4"
                                    name="workPlaces"
                                    value="Instituto_XYZ"
                                    registration={register("workPlaces")}
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="workplace_4" className="text-sm text-gray-700 cursor-pointer flex-1">
                                    {t("institute-xyz")}
                                </label>
                            </div>
                            <div className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded transition-colors duration-150">
                                <Input 
                                    type="checkbox"
                                    id="workplace_5"
                                    name="workPlaces"
                                    value="Hospital_Universitario"
                                    registration={register("workPlaces")}
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="workplace_5" className="text-sm text-gray-700 cursor-pointer flex-1">
                                    {t("university-hospital")}
                                </label>
                            </div>
                            <div className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded transition-colors duration-150">
                                <Input 
                                    type="checkbox"
                                    id="workplace_6"
                                    name="workPlaces"
                                    value="Clinica_Privada"
                                    registration={register("workPlaces")}
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="workplace_6" className="text-sm text-gray-700 cursor-pointer flex-1">
                                    {t("private-clinic")}
                                </label>
                            </div>
                        </div>
                    </div>
                    {errors.workPlaces && (
                        <div className="mt-2 flex items-center space-x-2 text-red-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-xs" role="alert">{errors.workPlaces.message}</span>
                        </div>
                    )}
                </div>
            </section>

            <div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <label className="flex items-start space-x-3 cursor-pointer">
                        <Input 
                            type="checkbox"
                            registration={register("termsAndConditions")}
                            id="termsAndConditions"
                            name="termsAndConditions"
                            required
                            className="mt-1.5"
                            disabled={isSubmitting}
                            />
                        <span className="text-sm text-gray-700 select-none">
                            {t("accept-terms-and-conditions")}
                            <Link href="#" type="next" variant="medical">{t("terms-and-conditions")}</Link> {" "} {t("and")} {" "}
                            <Link href="#" type="next" variant="medical">{t("privacy-policy")}</Link> {" "} {t("for")} {" "}
                            {" "} {t("information-verified-confirmation")}
                        </span>
                    </label>
                </div>
                {errors.termsAndConditions && (	
                    <div className="mt-2 flex items-center text-red-600 text-xs px-1">
                        <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{errors.termsAndConditions.message}</span>
                    </div>
                )}
            </div>

            {/* Error Messages */}
            {apiError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <svg 
                                className="w-5 h-5 text-red-600 mt-0.5" 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                            >
                                <path 
                                    fillRule="evenodd" 
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-red-800 mb-1">
                                {t('error-title')}
                            </h3>
                            <p className="text-sm text-red-700">
                                {apiError}
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => setApiError(null)}
                                className="text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-50 rounded-full p-1"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path 
                                        fillRule="evenodd" 
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[var(--color-medical-primary)] text-white py-2 px-4 rounded-lg hover:bg-[var(--color-medical-dark)] hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-medical-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
            >
                {isSubmitting ? t("creating") : t("submit")}
            </button>
       </form>
    )
}

export default RegisterForm