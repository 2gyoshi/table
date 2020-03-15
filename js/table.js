'use strict'

class Cell {
	constructor(text) {
		this.type = 'Cell';
		this.cellType = 'dataCell';
		this.text = text;
		this.cssClassList = [];
		this.child = [];
	}

	setText = (text) => {
		this.text = text;
	}

	getText = () => {
		return this.text;
	}

	getType = () => {
		return this.type;
	}

	setCellType = (cellType) => {
		this.cellType = cellType;
	}

	setCellType = () => {
		return this.cellType;
	}

	addCssClass = (cssClass) => {
		this.cssClassList.push(cssClass)
	}

	render = () => {
		const element = this.cellType === 'headerCell' ? document.createElement('dt') : document.createElement('dd');
		for (let cssClass of this.cssClassList) {
			element.classList.add(cssClass);
		}
		element.insertAdjacentHTML('beforeend', this.text);
		return element;
	}
}

class Row {
	constructor() {
		this.type = 'Row';
		this.rowType = 'dataRow';
		this.cells = [];
		this.visible = true;
		this.cssClassList = [];
	}

	addCell(cell) {
		if (cell.getType() !== 'Cell') {
			console.log('Row: 無効な引数が渡されました。');
			return;
		}
		this.cells.push(cell);
	}

	getCell(index) {
		return this.cells[index];
	}

	getCellLength() {
		return this.cells.length;
	}

	setRowType = (type) => {
		this.rowType = type;
	}

	getRowType = () => {
		return this.rowType;
	}

	getType = () => {
		return this.type;
	}

	render = () => {
		const dl = document.createElement('dl');
		for (let cssClass of this.cssClassList) {
			dl.classList.add(cssClass);
		}
		dl.insertAdjacentElement
		for (let cell of this.cells) {
			dl.insertAdjacentElement('beforeend', cell.render());
		}
		return dl;
	}

	filter = (text) => {
		if (this.rowType !== 'dataRow') return;

		this.visible = true;
		let result = false;
		const regexp = new RegExp(text);
		for (let cell of this.cells) {
			if (cell.getText().search(regexp) > -1) {
				result = true;
				
			}
		}
		this.visible = result;
	}
}

class Table {
	constructor(obj) {
		this.json = obj.json;
		this.headerTitleList = obj.headerTitleList;
		this.exportTargetDom = obj.exportTagetDOM;
		this.rows = [];
		this.columnCssClassList = obj.columnCssClassList;
		this.cssClassList = [];
	}

	addRow = (row) => {
		if (row.getType() !== 'Row') {
			console.log('Row: 無効な引数が渡されました。');
			return;
		}
		this.rows.push(row);
	}

	addcolumnCssClass = (columnCssClass) => {
		this.columnCssClass.push(columnCssClass);
	}

	createHeader = () => {
		const header = new Row();
		let cell;
		for (let title of this.headerTitleList) {
			cell = new Cell(title);
			cell.cellType = 'headerCell';
			header.addCell(cell);
		}
		header.setRowType('header');
		this.addRow(header);
	}

	createDataRow = () => {
		let newRow, newCell;
		for (let row of this.json) {
			newRow = new Row();
			for (let key of Object.keys(row)) {
				newCell = new Cell(row[key]);
				newRow.addCell(newCell);
			}
			this.addRow(newRow);
		}
	}

	createTable = () => {
		this.createHeader();
		this.createDataRow();
		this.attachCssClass();
	}

	attachCssClass = () => {
		for (let row of this.rows) {
			for (let i = 0; i < row.getCellLength(); i++) {
				row.getCell(i).addCssClass(this.columnCssClassList[i]);
			}
		}
	}

	render() {
		this.exportTargetDom.innerHTML = '';
		for (let row of this.rows) {
			if (row.visible === false) continue;
			this.exportTargetDom.insertAdjacentElement('beforeend', row.render());
		}
	}

	// 絞り込み
	filter = (array) => {
		for (let row of this.rows) {
			row.visible = true;
		}
		for (let key of array) {
			for (let row of this.rows) {
				if (row.visible === false) continue;
				row.filter(key);
			}
		}
		this.render();
	}
}

(function(){
        const data = [];
        let obj, tmp;
        for (let i = 0; i < 20; i++) {
            obj = {};
            for (let j = 0; j < 6; j++) {
                tmp = 'Test' + i + '_' + j
                obj[tmp] = tmp;
            }
            data.push(obj);
        }
		const tableTargetDOM = document.querySelector('.table');
		const columnCssClassList = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6'];
		const arg = {
			json: data,
			exportTagetDOM: tableTargetDOM,
			headerTitleList: ['test1', 'test2', 'test3', 'test4', 'test5', 'test6'],
			columnCssClassList: columnCssClassList
		};
        
        const table = new Table(arg);
		table.createTable();
		table.render();
})();




