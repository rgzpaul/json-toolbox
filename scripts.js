class CSVJSONConverter {
    constructor() {
        this.currentMode = 'csvToJson';
        this.initializeElements();
        this.attachEventListeners();
        this.setupDropZone();
    }

    initializeElements() {
        this.elements = {
            csvToJsonBtn: document.getElementById('csvToJsonBtn'),
            jsonToCsvBtn: document.getElementById('jsonToCsvBtn'),
            sortJsonBtn: document.getElementById('sortJsonBtn'),
            tableJsonBtn: document.getElementById('tableJsonBtn'),
            objectRemoverBtn: document.getElementById('objectRemoverBtn'),
            inputTitle: document.getElementById('inputTitle'),
            outputTitle: document.getElementById('outputTitle'),
            inputText: document.getElementById('inputText'),
            inputTextTable: document.getElementById('inputTextTable'),
            outputText: document.getElementById('outputText'),
            outputButtons: document.getElementById('outputButtons'),
            mainContent: document.getElementById('mainContent'),
            tableJsonLayout: document.getElementById('tableJsonLayout'),
            jsonTableFull: document.getElementById('jsonTableFull'),
            tableHeadersFull: document.getElementById('tableHeadersFull'),
            tableBodyFull: document.getElementById('tableBodyFull'),
            fileInput: document.getElementById('fileInput'),
            dropZone: document.getElementById('dropZone'),
            dropZoneTable: document.getElementById('dropZoneTable'),
            csvOptions: document.getElementById('csvOptions'),
            jsonOptions: document.getElementById('jsonOptions'),
            sortOptions: document.getElementById('sortOptions'),
            tableOptions: document.getElementById('tableOptions'),
            objectRemoverOptions: document.getElementById('objectRemoverOptions'),
            delimiter: document.getElementById('delimiter'),
            hasHeaders: document.getElementById('hasHeaders'),
            prettyJson: document.getElementById('prettyJson'),
            sortCriteria: document.getElementById('sortCriteria'),
            addSortCriteria: document.getElementById('addSortCriteria'),
            sortPrettyJson: document.getElementById('sortPrettyJson'),
            showRowNumbers: document.getElementById('showRowNumbers'),
            striped: document.getElementById('striped'),
            showRowNumbersTable: document.getElementById('showRowNumbersTable'),
            stripedTable: document.getElementById('stripedTable'),
            removalKey: document.getElementById('removalKey'),
            removalOperator: document.getElementById('removalOperator'),
            removalValue: document.getElementById('removalValue'),
            removerPrettyJson: document.getElementById('removerPrettyJson'),
            clearInput: document.getElementById('clearInput'),
            clearInputTable: document.getElementById('clearInputTable'),
            copyOutput: document.getElementById('copyOutput'),
            downloadOutput: document.getElementById('downloadOutput'),
            errorMessage: document.getElementById('errorMessage'),
            errorText: document.getElementById('errorText'),
            conversionStats: document.getElementById('conversionStats'),
            recordCount: document.getElementById('recordCount'),
            processingTime: document.getElementById('processingTime'),
            tableRecordCount: document.getElementById('tableRecordCount'),
            tableColumnCount: document.getElementById('tableColumnCount'),
            tableProcessingTime: document.getElementById('tableProcessingTime')
        };

        this.sortCriteriaCount = 0;
        this.availableKeys = [];
        this.tableData = [];
        this.tableSortColumn = null;
        this.tableSortDirection = 'asc';
    }

    attachEventListeners() {
        this.elements.csvToJsonBtn.addEventListener('click', () => this.switchMode('csvToJson'));
        this.elements.jsonToCsvBtn.addEventListener('click', () => this.switchMode('jsonToCsv'));
        this.elements.sortJsonBtn.addEventListener('click', () => this.switchMode('sortJson'));
        this.elements.tableJsonBtn.addEventListener('click', () => this.switchMode('tableJson'));
        this.elements.objectRemoverBtn.addEventListener('click', () => this.switchMode('objectRemover'));
        this.elements.inputText.addEventListener('input', () => this.handleInputChange());
        this.elements.inputTextTable.addEventListener('input', () => this.handleTableInputChange());
        this.elements.delimiter.addEventListener('change', () => this.convert());
        this.elements.hasHeaders.addEventListener('change', () => this.convert());
        this.elements.prettyJson.addEventListener('change', () => this.convert());
        this.elements.addSortCriteria.addEventListener('click', () => this.addSortCriteria());
        this.elements.sortPrettyJson.addEventListener('change', () => this.convert());
        this.elements.showRowNumbers.addEventListener('change', () => this.convert());
        this.elements.striped.addEventListener('change', () => this.convert());
        this.elements.showRowNumbersTable.addEventListener('change', () => this.convertTable());
        this.elements.stripedTable.addEventListener('change', () => this.convertTable());
        this.elements.removalKey.addEventListener('change', () => this.convert());
        this.elements.removalOperator.addEventListener('change', () => this.handleRemovalOperatorChange());
        this.elements.removalValue.addEventListener('input', () => this.convert());
        this.elements.removerPrettyJson.addEventListener('change', () => this.convert());
        this.elements.clearInput.addEventListener('click', () => this.clearInput());
        this.elements.clearInputTable.addEventListener('click', () => this.clearTableInput());
        this.elements.copyOutput.addEventListener('click', () => this.copyOutput());
        this.elements.downloadOutput.addEventListener('click', () => this.downloadOutput());
        this.elements.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    }

    setupDropZone() {
        // Main drop zone
        const dropZone = this.elements.dropZone;
        dropZone.addEventListener('click', () => this.elements.fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        // Table drop zone
        const dropZoneTable = this.elements.dropZoneTable;
        dropZoneTable.addEventListener('click', () => this.elements.fileInput.click());

        dropZoneTable.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZoneTable.classList.add('dragover');
        });

        dropZoneTable.addEventListener('dragleave', () => {
            dropZoneTable.classList.remove('dragover');
        });

        dropZoneTable.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZoneTable.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleTableFile(files[0]);
            }
        });
    }

    switchMode(mode) {
        this.currentMode = mode;

        // Reset all button styles
        this.elements.csvToJsonBtn.className = 'px-6 py-2 rounded-md font-medium transition-all duration-200 text-gray-700 hover:bg-gray-100';
        this.elements.jsonToCsvBtn.className = 'px-6 py-2 rounded-md font-medium transition-all duration-200 text-gray-700 hover:bg-gray-100';
        this.elements.sortJsonBtn.className = 'px-6 py-2 rounded-md font-medium transition-all duration-200 text-gray-700 hover:bg-gray-100';
        this.elements.tableJsonBtn.className = 'px-6 py-2 rounded-md font-medium transition-all duration-200 text-gray-700 hover:bg-gray-100';
        this.elements.objectRemoverBtn.className = 'px-6 py-2 rounded-md font-medium transition-all duration-200 text-gray-700 hover:bg-gray-100';

        // Hide all layouts
        this.elements.mainContent.classList.remove('hidden');
        this.elements.tableJsonLayout.classList.add('hidden');

        // Hide all options
        this.elements.csvOptions.classList.add('hidden');
        this.elements.jsonOptions.classList.add('hidden');
        this.elements.sortOptions.classList.add('hidden');
        this.elements.tableOptions.classList.add('hidden');
        this.elements.objectRemoverOptions.classList.add('hidden');

        if (mode === 'csvToJson') {
            this.elements.csvToJsonBtn.className = 'px-6 py-2 rounded-md font-medium transition-all duration-200 bg-blue-500 text-white';
            this.elements.inputTitle.textContent = 'Input CSV';
            this.elements.outputTitle.textContent = 'Output JSON';
            this.elements.inputText.placeholder = 'Paste your CSV data here...';
            this.elements.csvOptions.classList.remove('hidden');
        } else if (mode === 'jsonToCsv') {
            this.elements.jsonToCsvBtn.className = 'px-6 py-2 rounded-md font-medium transition-all duration-200 bg-blue-500 text-white';
            this.elements.inputTitle.textContent = 'Input JSON';
            this.elements.outputTitle.textContent = 'Output CSV';
            this.elements.inputText.placeholder = 'Paste your JSON data here...';
            this.elements.jsonOptions.classList.remove('hidden');
        } else if (mode === 'sortJson') {
            this.elements.sortJsonBtn.className = 'px-6 py-2 rounded-md font-medium transition-all duration-200 bg-blue-500 text-white';
            this.elements.inputTitle.textContent = 'Input JSON';
            this.elements.outputTitle.textContent = 'Sorted JSON';
            this.elements.inputText.placeholder = 'Paste your JSON array data here...';
            this.elements.sortOptions.classList.remove('hidden');
            this.initializeSortCriteria();
        } else if (mode === 'tableJson') {
            this.elements.tableJsonBtn.className = 'px-6 py-2 rounded-md font-medium transition-all duration-200 bg-blue-500 text-white';
            this.elements.mainContent.classList.add('hidden');
            this.elements.tableJsonLayout.classList.remove('hidden');
        } else if (mode === 'objectRemover') {
            this.elements.objectRemoverBtn.className = 'px-6 py-2 rounded-md font-medium transition-all duration-200 bg-blue-500 text-white';
            this.elements.inputTitle.textContent = 'Input JSON';
            this.elements.outputTitle.textContent = 'Filtered JSON';
            this.elements.inputText.placeholder = 'Paste your JSON array data here...';
            this.elements.objectRemoverOptions.classList.remove('hidden');
            this.updateAvailableKeys();
        }

        this.clearInput();
        this.convert();
    }

    handleInputChange() {
        if (this.currentMode === 'sortJson' || this.currentMode === 'objectRemover') {
            this.updateAvailableKeys();
        }
        this.convert();
    }

    handleTableInputChange() {
        this.convertTable();
    }

    handleRemovalOperatorChange() {
        const operator = this.elements.removalOperator.value;
        // Show value input for operators that need a comparison value
        if (['equals', 'not_equals', 'contains', 'not_contains'].includes(operator)) {
            this.elements.removalValue.classList.remove('hidden');
        } else {
            this.elements.removalValue.classList.add('hidden');
        }
        this.convert();
    }

    initializeSortCriteria() {
        this.elements.sortCriteria.innerHTML = '';
        this.sortCriteriaCount = 0;
        this.addSortCriteria();
    }

    addSortCriteria() {
        const criteriaId = `criteria_${this.sortCriteriaCount++}`;
        const criteriaDiv = document.createElement('div');
        criteriaDiv.className = 'flex items-center gap-2 sort-criteria';
        criteriaDiv.setAttribute('data-criteria-id', criteriaId);

        criteriaDiv.innerHTML = `
            <div class="flex-1">
                <label class="block text-xs text-gray-600 mb-1">Sort by key</label>
                <select class="sort-key w-full p-2 text-sm border border-gray-300 rounded">
                    <option value="">Select a key...</option>
                </select>
            </div>
            <div class="w-24">
                <label class="block text-xs text-gray-600 mb-1">Order</label>
                <select class="sort-order w-full p-2 text-sm border border-gray-300 rounded">
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                </select>
            </div>
            <div class="flex items-end">
                <button type="button" class="remove-criteria p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors" ${this.sortCriteriaCount === 1 ? 'style="visibility: hidden;"' : ''}>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        `;

        this.elements.sortCriteria.appendChild(criteriaDiv);

        // Add event listeners
        const sortKeySelect = criteriaDiv.querySelector('.sort-key');
        const sortOrderSelect = criteriaDiv.querySelector('.sort-order');
        const removeButton = criteriaDiv.querySelector('.remove-criteria');

        sortKeySelect.addEventListener('change', () => this.convert());
        sortOrderSelect.addEventListener('change', () => this.convert());
        removeButton.addEventListener('click', () => this.removeSortCriteria(criteriaDiv));

        // Populate with available keys
        this.populateSortKeyOptions(sortKeySelect);

        // Update remove button visibility
        this.updateRemoveButtonsVisibility();
    }

    removeSortCriteria(criteriaDiv) {
        criteriaDiv.remove();
        this.updateRemoveButtonsVisibility();
        this.convert();
    }

    updateRemoveButtonsVisibility() {
        const allCriteria = this.elements.sortCriteria.querySelectorAll('.sort-criteria');
        allCriteria.forEach((criteria, index) => {
            const removeButton = criteria.querySelector('.remove-criteria');
            removeButton.style.visibility = allCriteria.length === 1 ? 'hidden' : 'visible';
        });
    }

    updateAvailableKeys() {
        const inputText = this.elements.inputText.value.trim();
        if (!inputText) {
            this.availableKeys = [];
            this.updateAllSortKeyOptions();
            if (this.currentMode === 'objectRemover') {
                this.updateRemovalKeyOptions();
            }
            return;
        }

        try {
            const data = this.normalizeToArray(JSON.parse(inputText));
            if (!Array.isArray(data) || data.length === 0) {
                this.availableKeys = [];
                this.updateAllSortKeyOptions();
                if (this.currentMode === 'objectRemover') {
                    this.updateRemovalKeyOptions();
                }
                return;
            }

            const keys = new Set();
            data.forEach(item => {
                if (typeof item === 'object' && item !== null) {
                    Object.keys(item).forEach(key => keys.add(key));
                }
            });

            this.availableKeys = Array.from(keys).sort();
            this.updateAllSortKeyOptions();
            if (this.currentMode === 'objectRemover') {
                this.updateRemovalKeyOptions();
            }

        } catch (error) {
            this.availableKeys = [];
            this.updateAllSortKeyOptions();
            if (this.currentMode === 'objectRemover') {
                this.updateRemovalKeyOptions();
            }
        }
    }

    updateAllSortKeyOptions() {
        const allSortKeySelects = this.elements.sortCriteria.querySelectorAll('.sort-key');
        allSortKeySelects.forEach(select => {
            this.populateSortKeyOptions(select);
        });
    }

    populateSortKeyOptions(selectElement) {
        const currentValue = selectElement.value;
        selectElement.innerHTML = '<option value="">Select a key...</option>';

        if (this.availableKeys.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No valid array found';
            option.disabled = true;
            selectElement.appendChild(option);
            return;
        }

        this.availableKeys.forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            if (key === currentValue) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    }

    updateRemovalKeyOptions() {
        const select = this.elements.removalKey;
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select a key...</option>';

        if (this.availableKeys.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No valid array found';
            option.disabled = true;
            select.appendChild(option);
            return;
        }

        this.availableKeys.forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            if (key === currentValue) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            if (this.currentMode === 'tableJson') {
                this.handleTableFile(file);
            } else {
                this.handleFile(file);
            }
        }
    }

    handleFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.elements.inputText.value = e.target.result;
            this.handleInputChange();
        };
        reader.readAsText(file);
    }

    handleTableFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.elements.inputTextTable.value = e.target.result;
            this.handleTableInputChange();
        };
        reader.readAsText(file);
    }

    csvToJson(csvText) {
        const delimiter = this.elements.delimiter.value === '\\t' ? '\t' : this.elements.delimiter.value;
        const hasHeaders = this.elements.hasHeaders.checked;

        const lines = csvText.trim().split('\n');
        if (lines.length === 0) return [];

        let headers;
        let dataStart = 0;

        if (hasHeaders) {
            headers = this.parseCsvLine(lines[0], delimiter);
            dataStart = 1;
        } else {
            const firstLine = this.parseCsvLine(lines[0], delimiter);
            headers = firstLine.map((_, index) => `column_${index + 1}`);
        }

        const result = [];
        for (let i = dataStart; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = this.parseCsvLine(lines[i], delimiter);
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header.trim()] = this.parseValue(values[index] || '');
                });
                result.push(obj);
            }
        }

        return result;
    }

    parseCsvLine(line, delimiter) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === delimiter && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current);
        return result;
    }

    parseValue(value) {
        value = value.trim();
        if (value === '') return '';
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
        if (!isNaN(value) && !isNaN(parseFloat(value))) {
            return parseFloat(value);
        }
        return value;
    }

    normalizeToArray(data) {
        if (Array.isArray(data)) return data;
        if (typeof data === 'object' && data !== null) {
            return Object.entries(data).map(([key, value]) =>
                typeof value === 'object' ? { id: key, ...value } : { id: key, value }
            );
        }
        return data;
    }

    denormalizeToObject(data, originalInput) {
        try {
            const original = JSON.parse(originalInput);
            // Se l'input originale era un oggetto (non array), riconvertilo
            if (!Array.isArray(original) && typeof original === 'object') {
                const result = {};
                data.forEach(item => {
                    if (item.id) {
                        const { id, ...rest } = item;
                        result[id] = rest;
                    }
                });
                return result;
            }
        } catch (e) {
            // Se c'è un errore, ritorna l'array normale
        }
        return data;
    }

    jsonToCsv(jsonText) {
        const data = this.normalizeToArray(JSON.parse(jsonText));
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('JSON must be an array of objects');
        }

        const delimiter = this.elements.delimiter.value === '\\t' ? '\t' : this.elements.delimiter.value;
        const headers = Object.keys(data[0]);

        let csv = headers.map(header => this.escapeCsvValue(header)).join(delimiter) + '\n';

        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                return this.escapeCsvValue(value);
            });
            csv += values.join(delimiter) + '\n';
        });

        return csv.trim();
    }

    sortJson(jsonText) {
        const data = this.normalizeToArray(JSON.parse(jsonText));
        if (!Array.isArray(data)) {
            throw new Error('JSON must be an array');
        }

        // Get all sort criteria
        const sortCriteria = [];
        const allCriteria = this.elements.sortCriteria.querySelectorAll('.sort-criteria');

        allCriteria.forEach(criteriaDiv => {
            const sortKey = criteriaDiv.querySelector('.sort-key').value;
            const sortOrder = criteriaDiv.querySelector('.sort-order').value;

            if (sortKey) {
                sortCriteria.push({ key: sortKey, order: sortOrder });
            }
        });

        if (sortCriteria.length === 0) {
            throw new Error('Please select at least one key to sort by');
        }

        const sortedData = [...data].sort((a, b) => {
            for (const criteria of sortCriteria) {
                let aVal = a[criteria.key];
                let bVal = b[criteria.key];

                // Handle null/undefined values
                if (aVal == null && bVal == null) continue;
                if (aVal == null) return criteria.order === 'asc' ? -1 : 1;
                if (bVal == null) return criteria.order === 'asc' ? 1 : -1;

                // Convert to strings for comparison if they're not numbers
                if (typeof aVal !== 'number' || typeof bVal !== 'number') {
                    aVal = String(aVal).toLowerCase();
                    bVal = String(bVal).toLowerCase();
                }

                if (aVal < bVal) return criteria.order === 'asc' ? -1 : 1;
                if (aVal > bVal) return criteria.order === 'asc' ? 1 : -1;
                // If equal, continue to next criteria
            }
            return 0;
        });

        return sortedData;
    }

    removeObjects(jsonText) {
        const data = this.normalizeToArray(JSON.parse(jsonText));
        if (!Array.isArray(data)) {
            throw new Error('JSON must be an array');
        }

        const key = this.elements.removalKey.value;
        const operator = this.elements.removalOperator.value;
        const value = this.elements.removalValue.value;

        if (!key) {
            throw new Error('Please select a key to filter by');
        }

        const filteredData = data.filter(item => {
            // Skip non-objects
            if (typeof item !== 'object' || item === null) {
                return true;
            }

            const hasKey = key in item;
            const itemValue = item[key];

            switch (operator) {
                case 'exists':
                    return !hasKey;
                case 'not_exists':
                    return hasKey;
                case 'equals':
                    return !hasKey || String(itemValue) !== value;
                case 'not_equals':
                    return !hasKey || String(itemValue) === value;
                case 'contains':
                    return !hasKey || !String(itemValue).includes(value);
                case 'not_contains':
                    return !hasKey || String(itemValue).includes(value);
                default:
                    return true;
            }
        });

        return filteredData;
    }

    createTable(data) {
        if (!Array.isArray(data) || data.length === 0) {
            this.elements.tableHeadersFull.innerHTML = '';
            this.elements.tableBodyFull.innerHTML = '<tr><td class="p-4 text-center text-gray-500" colspan="100%">No data to display</td></tr>';
            this.updateTableStats(0, 0);
            return;
        }

        this.tableData = [...data];
        this.tableSortColumn = null;
        this.tableSortDirection = 'asc';

        // Get all unique keys from all objects
        const allKeys = new Set();
        data.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                Object.keys(item).forEach(key => allKeys.add(key));
            }
        });

        const keys = Array.from(allKeys);
        const showRowNumbers = this.elements.showRowNumbersTable.checked;

        // Create headers
        let headerHtml = '';
        if (showRowNumbers) {
            headerHtml += '<th class="p-3 text-left border-b border-gray-200 font-medium text-gray-700 bg-gray-50">#</th>';
        }

        keys.forEach(key => {
            headerHtml += `
                <th class="sortable-header p-3 text-left border-b border-gray-200 font-medium text-gray-700 bg-gray-50" data-column="${key}">
                    ${key}
                    <span class="sort-indicator"></span>
                </th>
            `;
        });

        this.elements.tableHeadersFull.innerHTML = '<tr>' + headerHtml + '</tr>';

        // Add click listeners to headers
        this.elements.tableHeadersFull.querySelectorAll('.sortable-header').forEach(header => {
            header.addEventListener('click', () => {
                const column = header.getAttribute('data-column');
                this.sortTableFull(column);
            });
        });

        this.renderTableBodyFull(keys);
        this.updateTableStats(data.length, keys.length);
    }

    renderTableBodyFull(keys) {
        const showRowNumbers = this.elements.showRowNumbersTable.checked;
        const striped = this.elements.stripedTable.checked;

        let bodyHtml = '';
        this.tableData.forEach((item, index) => {
            const rowClass = striped ? 'striped' : '';
            bodyHtml += `<tr class="${rowClass}">`;

            if (showRowNumbers) {
                bodyHtml += `<td class="p-3 border-b border-gray-200 text-gray-600 text-sm">${index + 1}</td>`;
            }

            keys.forEach(key => {
                let value = item[key];
                if (value === null || value === undefined) {
                    value = '<span class="text-gray-400 italic">null</span>';
                } else if (typeof value === 'object') {
                    value = '<span class="text-blue-600 font-mono text-xs">' + JSON.stringify(value) + '</span>';
                } else if (typeof value === 'boolean') {
                    value = `<span class="text-purple-600 font-medium">${value}</span>`;
                } else if (typeof value === 'number') {
                    value = `<span class="text-green-600 font-mono">${value}</span>`;
                } else {
                    value = String(value);
                }

                bodyHtml += `<td class="p-3 border-b border-gray-200 text-sm">${value}</td>`;
            });

            bodyHtml += '</tr>';
        });

        this.elements.tableBodyFull.innerHTML = bodyHtml;
    }

    sortTableFull(column) {
        // Update sort direction
        if (this.tableSortColumn === column) {
            this.tableSortDirection = this.tableSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.tableSortColumn = column;
            this.tableSortDirection = 'asc';
        }

        // Sort the data
        this.tableData.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];

            // Handle null/undefined values
            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return this.tableSortDirection === 'asc' ? -1 : 1;
            if (bVal == null) return this.tableSortDirection === 'asc' ? 1 : -1;

            // Convert to strings for comparison if they're not numbers
            if (typeof aVal !== 'number' || typeof bVal !== 'number') {
                aVal = String(aVal).toLowerCase();
                bVal = String(bVal).toLowerCase();
            }

            if (aVal < bVal) return this.tableSortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.tableSortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        // Update sort indicators
        this.elements.tableHeadersFull.querySelectorAll('.sort-indicator').forEach(indicator => {
            indicator.className = 'sort-indicator';
        });

        const activeHeader = this.elements.tableHeadersFull.querySelector(`[data-column="${column}"] .sort-indicator`);
        if (activeHeader) {
            activeHeader.className = `sort-indicator ${this.tableSortDirection}`;
        }

        // Re-render table body
        const keys = Array.from(new Set(this.tableData.flatMap(item => Object.keys(item))));
        this.renderTableBodyFull(keys);
    }

    updateTableStats(recordCount, columnCount) {
        this.elements.tableRecordCount.textContent = recordCount;
        this.elements.tableColumnCount.textContent = columnCount;
    }

    escapeCsvValue(value) {
        if (value === null || value === undefined) return '';

        const stringValue = String(value);
        const delimiter = this.elements.delimiter.value === '\\t' ? '\t' : this.elements.delimiter.value;

        if (stringValue.includes(delimiter) || stringValue.includes('"') || stringValue.includes('\n')) {
            return '"' + stringValue.replace(/"/g, '""') + '"';
        }

        return stringValue;
    }

    convert() {
        if (this.currentMode === 'tableJson') {
            return; // Table mode has its own convert method
        }

        const inputText = this.elements.inputText.value.trim();
        if (!inputText) {
            this.elements.outputText.value = '';
            this.hideError();
            this.hideStats();
            return;
        }

        const startTime = performance.now();

        try {
            let result;
            let recordCount = 0;

            if (this.currentMode === 'csvToJson') {
                const jsonData = this.csvToJson(inputText);
                recordCount = jsonData.length;
                result = this.elements.prettyJson.checked
                    ? JSON.stringify(jsonData, null, 2)
                    : JSON.stringify(jsonData);
            } else if (this.currentMode === 'jsonToCsv') {
                result = this.jsonToCsv(inputText);
                const lines = result.split('\n').filter(line => line.trim());
                recordCount = Math.max(0, lines.length - 1); // Subtract header row
            } else if (this.currentMode === 'sortJson') {
                const sortedData = this.sortJson(inputText);
                const finalData = this.denormalizeToObject(sortedData, inputText);
                recordCount = sortedData.length;
                result = this.elements.sortPrettyJson.checked
                    ? JSON.stringify(finalData, null, 2)
                    : JSON.stringify(finalData);
            } else if (this.currentMode === 'objectRemover') {
                const filteredData = this.removeObjects(inputText);
                const finalData = this.denormalizeToObject(filteredData, inputText);
                recordCount = filteredData.length;
                result = this.elements.removerPrettyJson.checked
                    ? JSON.stringify(finalData, null, 2)
                    : JSON.stringify(finalData);
            }

            this.elements.outputText.value = result;
            this.hideError();

            const endTime = performance.now();
            this.showStats(recordCount, endTime - startTime);

        } catch (error) {
            this.showError(error.message);
            this.elements.outputText.value = '';
            this.hideStats();
        }
    }

    convertTable() {
        const inputText = this.elements.inputTextTable.value.trim();
        if (!inputText) {
            this.elements.tableHeadersFull.innerHTML = '';
            this.elements.tableBodyFull.innerHTML = '<tr><td class="p-4 text-center text-gray-500" colspan="100%">Paste JSON array data to see table</td></tr>';
            this.hideError();
            this.updateTableStats(0, 0);
            this.elements.tableProcessingTime.textContent = '0ms';
            return;
        }

        const startTime = performance.now();

        try {
            const data = this.normalizeToArray(JSON.parse(inputText));
            if (!Array.isArray(data)) {
                throw new Error('JSON must be an array for table view');
            }
            this.createTable(data);
            this.hideError();

            const endTime = performance.now();
            this.elements.tableProcessingTime.textContent = `${(endTime - startTime).toFixed(2)}ms`;

        } catch (error) {
            this.showError(error.message);
            this.elements.tableHeadersFull.innerHTML = '';
            this.elements.tableBodyFull.innerHTML = '<tr><td class="p-4 text-center text-red-500" colspan="100%">Invalid JSON data</td></tr>';
            this.updateTableStats(0, 0);
            this.elements.tableProcessingTime.textContent = '0ms';
        }
    }

    clearInput() {
        this.elements.inputText.value = '';
        this.elements.outputText.value = '';
        this.elements.fileInput.value = '';
        this.availableKeys = [];
        if (this.currentMode === 'sortJson') {
            this.initializeSortCriteria();
        }
        this.hideError();
        this.hideStats();
    }

    clearTableInput() {
        this.elements.inputTextTable.value = '';
        this.elements.fileInput.value = '';
        this.elements.tableHeadersFull.innerHTML = '';
        this.elements.tableBodyFull.innerHTML = '<tr><td class="p-4 text-center text-gray-500" colspan="100%">Paste JSON array data to see table</td></tr>';
        this.updateTableStats(0, 0);
        this.elements.tableProcessingTime.textContent = '0ms';
        this.hideError();
    }

    async copyOutput() {
        if (this.currentMode === 'tableJson') {
            return; // No copy functionality for table mode
        }

        const output = this.elements.outputText.value;
        if (!output) return;

        try {
            await navigator.clipboard.writeText(output);
            const originalText = this.elements.copyOutput.textContent;
            this.elements.copyOutput.textContent = 'Copied!';
            this.elements.copyOutput.className = 'px-4 py-2 bg-green-600 text-white rounded-lg transition-colors text-sm';

            setTimeout(() => {
                this.elements.copyOutput.textContent = originalText;
                this.elements.copyOutput.className = 'px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm';
            }, 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    }

    downloadOutput() {
        if (this.currentMode === 'tableJson') {
            return; // No download functionality for table mode
        }

        const output = this.elements.outputText.value;
        if (!output) return;

        let extension, mimeType;
        if (this.currentMode === 'csvToJson' || this.currentMode === 'sortJson' || this.currentMode === 'objectRemover') {
            extension = 'json';
            mimeType = 'application/json';
        } else {
            extension = 'csv';
            mimeType = 'text/csv';
        }

        const blob = new Blob([output], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showError(message) {
        this.elements.errorText.textContent = message;
        this.elements.errorMessage.classList.remove('hidden');
        this.elements.errorMessage.classList.add('fade-in');
    }

    hideError() {
        this.elements.errorMessage.classList.add('hidden');
    }

    showStats(recordCount, processingTime) {
        this.elements.recordCount.textContent = `${recordCount} records processed`;
        this.elements.processingTime.textContent = `${processingTime.toFixed(2)}ms`;
        this.elements.conversionStats.classList.remove('hidden');
        this.elements.conversionStats.classList.add('fade-in');
    }

    hideStats() {
        this.elements.conversionStats.classList.add('hidden');
    }
}

// Initialize the converter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CSVJSONConverter();
});