function getMySecrets() {
    const scriptProperties = PropertiesService.getScriptProperties();

    // Retrieve the value
    SECRETS_CONFIG['GEMINI_API_KEY'] = scriptProperties.getProperty('GEMINI_API_KEY');
}