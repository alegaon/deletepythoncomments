const vscode = require('vscode');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.removePythonComments', () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;

            // Verifica si el archivo es un archivo Python
            if (document.languageId === 'python') {
                const text = document.getText();
                const newText = removePythonComments(text);

                // Reemplaza el texto del documento con el nuevo texto sin comentarios
                editor.edit(editBuilder => {
                    editBuilder.replace(
                        new vscode.Range(document.positionAt(0), document.positionAt(text.length)),
                        newText
                    );
                }).then(success => {
                    // Si la edición fue exitosa, guarda el documento
                    if (success) {
                        document.save();
                    }
                });
            } else {
                vscode.window.showErrorMessage('El archivo no es un archivo Python.');
            }
        } else {
            vscode.window.showErrorMessage('No hay editor de texto activo.');
        }
    });

    context.subscriptions.push(disposable);
}

exports.activate = activate;

function removePythonComments(text) {
    // Expresión regular para encontrar comentarios de una línea y comentarios multilinea
    const commentRegex = /(^#[^\r\n]*$)|(^\s*"""\s*[\s\S]*?"""\s*$)|(^\s*'''\s*[\s\S]*?'''\s*$)/gm;
    // Remueve los comentarios y retorna el texto modificado
    return text.replace(commentRegex, '');
}
