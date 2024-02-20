<script lang="ts">
	import AccountSelect from '../_components/AccountSelect.svelte';
	import type { AccountPreviewData } from '@t/accountPreviewData.type';

	const accounts: AccountPreviewData[] = [
		{
			address: '0xAdsa4456',
			name: 'Regular account',
		},

		{
			address: '0xCXs3Ik456',
			name: 'Not just regular account',
		},

		{
			address: '0xBXs3Ik456',
			name: 'Not just regular account 2',
		},
	];
</script>

<!-- <AccountPreview data={{ address: '0x5B38D...ddC4', name: 'Regular account' }} manageable /> -->
<AccountSelect previewsData={accounts} className="w-[200px]" />
