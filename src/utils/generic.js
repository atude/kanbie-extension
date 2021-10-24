export const labelRegex = /@\[([^\]]*)\]\(([^)]*)\)/g;
export const maxItems = 10;

// Remove labels/times and pre white space
export const filterString = (txt) => 
	txt
		.replace(/\s/g, "")
		.replace(/@\[([^\]]*)\]\(([^)]*)\)/g, "");
